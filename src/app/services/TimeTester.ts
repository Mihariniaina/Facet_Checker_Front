export class TimeTester{

    times;
    idc;
    name; 

    constructor(name){
      this.times = new Map();
      this.idc=0;
      this.name = name;  
    }
    public start(){
      this.times.set("start",performance.now());
    }
    public mark(label){
      this.times.set("ID : "+this.idc+" - "+label,performance.now());
      this.idc++;
    }
    public end(){
      this.times.set("end",performance.now());
    }
    public recap(){
      console.log(`-------------------- Timer recap start ${this.name} --------------------`);
      let startTime = this.times.get("start");
      let endTime = this.times.get("end");
      console.dir(Array.from(this.times.entries()).map(([k,v])=> ({[k]:(v - startTime)/1000}) ) ,  {'maxArrayLength': null}) ;
      console.log(`Total elapsed time : ${(endTime-startTime)/(1000)} s`);
      console.log(`-------------------- Timer recap end ${this.name} --------------------`);
    }
  }