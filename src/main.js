// コントロールの有効/無効を設定する
function setEnable(isRunning)
{
    document.getElementById("btnStart").disabled = isRunning;
    document.getElementById("btnStop").disabled = !isRunning;
    document.getElementById("times").disabled = isRunning;
}

// 1hour,1min,1secをmsec単位で。
const oneSecMsec = 1000;
const oneMinMsec = 60 * oneSecMsec;
const oneHourMsec = 60 * oneMinMsec;

// 0埋め2桁
function zeroPadding(str)
{
    return ("00"+str).slice(-2);
}

// msecの値を、hh:mm:ss形式の文字列で返す。
function msec2timeformat(msec)
{
    const hour = Math.floor(msec / oneHourMsec);
    const remH = msec % oneHourMsec;
    const min = Math.floor(remH / oneMinMsec);
    const remM = remH % oneMinMsec;
    const sec = Math.floor(remM / oneSecMsec);
    return zeroPadding(hour) + ":" + zeroPadding(min) + ":" + zeroPadding(sec);
}

// 画面に表示している時間をクリアする。
function resetTimeValue()
{
    document.getElementById("timeValue").innerHTML = msec2timeformat(0);
}

// msec単位の値を受けとり、hh:mm:ss形式に変換して、画面に表示する。
function elapsed1secHandler(msec)
{
    document.getElementById("timeValue").innerHTML = msec2timeformat(msec);
}

// 所定の時間が経過したときに実行されるコールバック。
function elapsedHandler(eventargs)
{
    // 通知ウィンドウに表示するアイコンのパス。
    const imgpath = eventargs.isCompleted? "../image/complete.png" : "../image/continue.png";

    // Notification
    const options = {
        body: "Elapsed Seq No." + eventargs.elapsedSeqIndex,
        icon: imgpath
    };
    const ntf = new Notification("SequentialTimer",options);

    // 通知音鳴動
    const audio = new Audio("file:///C:/WINDOWS/Media/Ring01.wav");
    audio.play();

    // 進捗表更新
    setProgress(eventargs.elapsedSeqIndex + 1);

    // シーケンスが完了したら、コントロールの有効/無効を変更する。
    if(eventargs.isCompleted)
        setEnable(false);
}

// シーケンスの進捗管理表を作成する。
function createSequenceTable(times)
{
    const tbody = document.getElementById("seqTable");
    while(tbody.firstChild){
        tbody.removeChild(tbody.firstChild);
    }
    for(i = 0; i < times.length; ++i)
    {
        const row = document.createElement("tr");
        const col_no = document.createElement("td");
        col_no.innerHTML = i;
        col_no.id = "col_no";
        const col_progress = document.createElement("td");
        col_progress.innerHTML = "   ";
        col_progress.id = "col_progress";
        const col_time = document.createElement("td");
        col_time.innerHTML = times[i];
        col_time.id = "col_time";
        col_time.align = "right";
        row.appendChild(col_no);
        row.appendChild(col_progress);
        row.appendChild(col_time);
        tbody.appendChild(row);
    }
}

// 進捗率を更新する。
function setProgress(index)
{
    const tbody = document.getElementById("seqTable");
    const childCount = tbody.childElementCount;
    if(childCount == 0)
        return;
    for(i = 0; i < childCount; ++i)
    {
        // 完了
        if(i < index)
            tbody.children[i].children["col_progress"].style.backgroundColor = "lightgreen";
        // 実行中
        else if (i == index)
            tbody.children[i].children["col_progress"].style.backgroundColor = "pink";
        else
            tbody.children[i].children["col_progress"].style.backgroundColor = null;
    }
}

// 初期化処理
function initialize() {
    let seqTimer;
    // 通知許可
    Notification.requestPermission();
    // コントロールのEnabled/Disabled変更
    setEnable(false);
    // 時間表示リセット
    resetTimeValue();
    // STARTボタンクリック時の処理追加
    document.getElementById("btnStart").onclick = function()
    {
        try
        {
            // シーケンス作成
            const txtTimes = document.getElementById("times").value;
            if (txtTimes == ""){
                alert("Timer Config is empty");
                return;
            }
            const times = parseSequence(txtTimes);

            // 進捗管理表作成 & 初期ステータスセット
            createSequenceTable(times.map(e => e[0]));
            setProgress(0);

            // タイマー実行
            seqTimer = new SeqTimer(times.map(e => e[1]));
            seqTimer.startTimer(elapsed1secHandler, elapsedHandler);
            setEnable(true);
            resetTimeValue();
        }
        catch(e)
        {
            alert(e);
        }
    };

    // STOPボタンクリック時の処理追加
    document.getElementById("btnStop").onclick = function()
    {
        if (seqTimer === null)
            return;
        seqTimer.stopTimer();
        seqTImer = null;
        setEnable(false);
        setProgress(-1);
    };
};

try
{
    // for jest
    module.exports = {
        "zeroPadding": zeroPadding,
        "msec2timeformat": msec2timeformat
    };
}
catch(e)
{
}
