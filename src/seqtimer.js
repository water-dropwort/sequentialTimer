// タイマークラス
class SeqTimer
{
    ////////////////////////////////
    // private fields
    ////////////////////////////////
    // 実行中か
    #mIsRunning = false;
    // タイマー
    #mTimer;
    // 時間の配列(シーケンス)
    #mTimes;
    // 現在のシーケンスのインデックス
    #mIndex;
    // タイマーカウント(msec単位)
    #mTimerCount;
    // setIntervalに設定するコールバック
    #mCallback = (obj) => function (){
        // 1sec経過イベント発火
        obj.#mIncrement1sec();
        obj.#mElapsed1secHandler(obj.#mTimerCount);
        // 1シーケンス分の時間経過
        if (obj.#mTimerCount >= obj.#mTimes[obj.#mIndex])
        {
            // シーケンスの最後まで到達したか
            const isCompleted = (obj.#mIndex == (obj.#mTimes.length - 1));
            // elapsedに渡すコールバックを作成し、イベントを発火する
            const args = new elapsedEventArgs(obj.#mIndex, obj.#mTimes[obj.#mIndex], isCompleted);
            obj.#mElapsedHandler(args);
            // シーケンスの最後まで到達していない。
            if(!isCompleted)
            {
                obj.#mIncrement();
                obj.#mResetTimerCount();
            }
            else
            {
                obj.stopTimer();
            }
        }
    };
    // タイマーセット
    #mSetTimer = function (){
        this.#mTimer = setInterval(this.#mCallback(this),1000);
    };
    // 時間経過時のイベントハンドラ
    #mElapsed1secHandler;
    #mElapsedHandler;
    // シーケンスのインデックスをインクリメントする。
    #mIncrement = function(){this.#mIndex += 1;}
    // タイマーカウントを1秒分インクリメント
    #mIncrement1sec = function(){this.#mTimerCount += 1000;}
    // タイマーカウントリセット
    #mResetTimerCount = function(){this.#mTimerCount = 0;}
    ////////////////////////////////
    // constructor
    ////////////////////////////////
    constructor(times) {
        this.#mTimes = times;
    }
    ////////////////////////////////
    // functions
    ////////////////////////////////
    // タイマー起動
    startTimer(elapsed1secHandler,elapsedHandler) {
        if (this.#mIsRunning == true)
            return;
        this.#mIndex = 0;
        this.#mResetTimerCount();
        this.#mElapsed1secHandler = elapsed1secHandler;
        this.#mElapsedHandler = elapsedHandler;
        this.#mSetTimer();
        this.#mIsRunning = true;
    }
    // タイマー停止
    stopTimer() {
        if (this.#mIsRunning == false)
            return;
        clearInterval(this.#mTimer);
        this.#mIsRunning = false;
    }
}

class elapsedEventArgs
{
    elapsedSeqIndex;
    elapsedSeqTimeMSEC;
    isCompleted;
    constructor(index,time,isCompleted)
    {
        this.elapsedSeqIndex = index;
        this.elapsedSeqTimeMSEC = time;
        this.isCompleted = isCompleted;
    }
}
