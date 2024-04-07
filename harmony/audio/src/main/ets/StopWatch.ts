export class StopWatch {
  private startTime: number = 0;
  private elapsedTime: number = 0;
  private paused: boolean = true;

  public start(): void {
    this.startTime = new Date().getTime();
    this.paused = false;
  }

  public stop(): number {
    if (!this.paused) {
      let nowTime = new Date().getTime();
      this.elapsedTime += (nowTime - this.startTime) / 1000;
      this.paused = true;
    }
    return this.elapsedTime;
  }

  public reset(): void {
    this.startTime = 0;
    this.elapsedTime = 0;
    this.paused = true;
  }

  public getTimeSeconds(): number {
    let seconds: number = 0;
    if (this.paused) {
      seconds = this.elapsedTime;
    } else {
      let nowTime = new Date().getTime();
      seconds = this.elapsedTime + (nowTime - this.startTime) / 1000;
    }
    return seconds;
  }
}