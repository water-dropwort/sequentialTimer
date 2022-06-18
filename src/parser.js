// シーケンスのパラメータのパース
function parseSequence(confs)
{
    const ary = confs.replace(/\s/g,"").split(">");
    return ary.map(parseTime);
};

// 単位付きの時間の文字列のパース。milisecond単位の数値を返す。
function parseTime(conf)
{
    var i = 0;
    var v = 0;
    for(; i < conf.length; i++)
    {
        let c = conf.charAt(i);
        if (isFinite(c))
            v = v * 10 + parseInt(c);
        else
            break;
    }

    if(i == 0)
        throw new Error("Invalid format. [" + conf + "]");

    const unit = conf.substring(i);
    if (unit === "min")
        return [conf,v * 60 * 1000]; // minute to milisecond
    else if(unit === "sec")
        return [conf,v * 1000]; // second to milisecond
    else
        throw new Error("Invalid format. [" + conf + "]");
};

try
{
    // for jest
    module.exports = {
        "parseSequence": parseSequence,
        "parseTime": parseTime
    };
}
catch(e)
{
}
