/*
 * MIT License
 *
 * Copyright (C) 2023 Huawei Device Co., Ltd.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

class StopWatch {
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

export const stopWatch = new StopWatch();