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
    // setTimeoutに設定するコールバック
    #mCallback = (obj) => function (){
        // シーケンスの最後まで到達したか
        const isCompleted = (obj.#mIndex == (obj.#mTimes.length - 1));
        // elapsedに渡すコールバックを作成し、イベントを発火する
        const args = new elapsedEventArgs(obj.#mIndex, obj.#mTimes[obj.#mIndex], isCompleted);
        obj.#mElapsedHandler(args);
        // シーケンスの最後まで到達していないならば、次のタイマーを起動する。
        if(!isCompleted)
        {
            obj.#mIncrement();
            obj.#mSetTimeout();
        }
    };
    // タイマーセット
    #mSetTimeout = function (){
        this.#mTimer = setTimeout(this.#mCallback(this),this.#mTimes[this.#mIndex]);
    };
    // 時間経過時のイベントハンドラ
    #mElapsedHandler;
    // シーケンスのインデックスをインクリメントする。
    #mIncrement = function(){this.#mIndex += 1;}
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
    startTimer(elapsedHandler) {
        if (this.#mIsRunning == true)
            return;
        this.#mIndex = 0;
        this.#mElapsedHandler = elapsedHandler;
        this.#mSetTimeout();
        this.#mIsRunning = true;
    }
    // タイマー停止
    stopTimer() {
        if (this.#mIsRunning == false)
            return;
        clearTimeout(this.#mTimer);
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
