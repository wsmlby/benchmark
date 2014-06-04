/**
 * 
 */
Benchmark = function(func, name) {
	this.func = func;
	this.name = name;
}
var print = console.log;
Benchmark.prototype.run = function(number, concurrent) {
	this.time = [];
	this.fired = 0;
	this.received = 0;
	this.total = number;
	this.c = concurrent;
	this.begin = Date.now();
	for (var i = 0; i < concurrent; i++) {
		this.startOne();
	}
}
Benchmark.prototype.startOne = function() {
	var index = this.time.length;
	var bench = this;
	if (this.fired < this.total) {
		this.time.push(Date.now());
		this.func(function() {
			bench.time[index] = Date.now() - bench.time[index];
			bench.received++;
			bench.startOne();
			bench.checkResult();
		});
		this.fired++;
	}
}
Benchmark.prototype.checkResult = function() {
	if (this.received % 100 == 0) {
		console.log("Completed " + this.received + " requests");
	}
	if (this.received == this.total) {
		print("Finished " + this.received + " requests");
		print("");
		print("Target:\t"+this.name);
		print("");
		print("Concurrency Level:\t"+this.c);
		var t = (Date.now()-this.begin)/1000.0;
		print("Time taken for tests:\t"+t+" seconds");
		print("Requests per second:\t"+this.total/t+" [#/sec] (mean)");
		this.time = this.time.sort();
		var sum = 0;
		for(var i = 0; i < this.total; i++){
			sum+= this.time[i];
		}
		print("Time per request:\t"+(sum/(this.total+0.0))+" [ms] (mean)");
		print("Time per request:\t"+t*1000/this.total+" [ms] (mean, across all concurrent requests)");
		print("");
		print("Percentage of the requests served within a certain time (ms)");
		var arr = [2,3,4,5,10,20,50,100];
		for(var i = 0; i < arr.length; i++){
			var p = parseInt(this.total-this.total/arr[i]);
			print("  "+parseInt(100-100/arr[i])+"%\t"+this.time[p]);
		}
		print(" 100%\t"+this.time[this.total-1] +" (longest request)");
	}
}
exports.Benchmark = Benchmark;

