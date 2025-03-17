"use strict";

const GHOST = {
    Oni: { EVIDENCE: ["EMF", "ZERO", "DOTS"] },
    Onryo: { EVIDENCE: ["SBOX", "ORB", "ZERO"] },
    Shade: { EVIDENCE: ["EMF", "WRITE", "ZERO"] },
    Jinn: { EVIDENCE: ["EMF", "UV", "ZERO"] },
    Spirit: { EVIDENCE: ["EMF", "SBOX", "WRITE"] },
    Thaye: { EVIDENCE: ["ORB", "WRITE", "DOTS"] },
    Twins: { EVIDENCE: ["EMF", "SBOX", "ZERO"] },
    Demon: { EVIDENCE: ["UV", "WRITE", "ZERO"] },
    Deogen: { EVIDENCE: ["SBOX", "WRITE", "DOTS"] },
    GhostFox: { EVIDENCE: ["EMF", "UV", "ORB"] },
    Banshee: { EVIDENCE: ["UV", "ORB", "DOTS"] },
    Hantu: { EVIDENCE: ["UV", "ORB", "ZERO"] },
    Phantom: { EVIDENCE: ["SBOX", "UV", "DOTS"] },
    Poltergeist: { EVIDENCE: ["SBOX", "UV", "WRITE"] },
    Myling: { EVIDENCE: ["EMF", "UV", "WRITE"] },
    Mimic: { EVIDENCE: ["ORB", "SBOX", "UV", "ZERO"] },
    Mare: { EVIDENCE: ["SBOX", "ORB", "WRITE"] },
    Moroi: { EVIDENCE: ["SBOX", "WRITE", "ZERO"] },
    Raiju: { EVIDENCE: ["EMF", "ORB", "DOTS"] },
    Wraith: { EVIDENCE: ["EMF", "SBOX", "DOTS"] },
    Revenant: { EVIDENCE: ["ORB", "WRITE", "ZERO"] },
    Yurei: { EVIDENCE: ["ORB", "ZERO", "DOTS"] },
    Yokai: { EVIDENCE: ["SBOX", "ORB", "DOTS"] },
    Goryo: { EVIDENCE: ["DOTS", "EMF", "UV"] },
};

let evidence = {
    EMF: "unknown",
    ZERO: "unknown",
    DOTS: "unknown",
    SBOX: "unknown",
    ORB: "unknown",
    UV: "unknown",
    WRITE: "unknown",
};

let notInEvidenceList = [];

document.addEventListener("DOMContentLoaded", async () => {
    //longPressの初期化
    longPress.init();

    document.addEventListener("click", function (event) {
        const target = event.target;
        // console.log({ target });

        //エビデンスリストのクリックイベント
        if (target.classList.contains("evidence")) {
            let targetEvidence = target.id.slice(1);
            console.log(`click:${targetEvidence}`);

            //クリックによって、ON->OFF->unknown を繰り返す
            if (target.classList.contains("on")) {
                //選択したエビデンスをOFFに
                target.classList.remove("on");
                target.classList.add("off");
                evidence[targetEvidence] = "OFF";
            } else if (target.classList.contains("off")) {
                //選択したエビデンスを未選択に
                target.classList.remove("off");
                evidence[targetEvidence] = "unknown";
            } else {
                //選択したエビデンスをONに
                target.classList.add("on");
                target.classList.remove("off");
                evidence[targetEvidence] = "ON";
            }
            console.log(evidence);
            ghostListUpdate();
        }

        //サイドメニューの動き
        if (target.id == "_SIDE_BUTTON" || target.id == "_SIDE_AREA_BACK") {
            // console.log("Click->SideeButton");
            _SIDE_BUTTON.classList.toggle("on");
        }

        //Ghostの表示非表示（手動）
        if (target.classList.contains("gHide")) {
            target.parentNode.classList.toggle("hide");
        }

        //エビデンスのリセット
        if (target.id == "_EVIDENCE_RESET") {
            reset();
        }

        //ストップウォッチ
        if (target.id == "_TIMER_BUTTON") {
            if (!target.classList.contains("on")) {
                console.log("start");
                stopWatch(true);
            } else {
                stopWatch(false);
            }
            target.classList.toggle("on");
        }

        //サイドメニューの動き
        if (target.id.slice(0, 5) == "_MENU") {
            Array.from(document.getElementsByClassName("pages")).forEach(
                (el) => {
                    el.classList.add("hide");
                }
            );
            document
                .getElementById(`${target.id.slice(5)}_PAGE`)
                .classList.remove("hide");
            _SIDE_BUTTON.classList.remove("on");
        }
    });
});

/**
 * ebidenceの値によってゴーストリストの表示を更新
 */
const ghostListUpdate = () => {
    const countON = Object.values(evidence).filter(
        (value) => value === "ON"
    ).length;
    const countOFF = Object.values(evidence).filter(
        (value) => value === "OFF"
    ).length;
    const countUnknown = Object.values(evidence).filter(
        (value) => value === "unknown"
    ).length;
    console.log({ countON, countOFF, countUnknown });

    let disGhostList = Object.keys(GHOST);

    if (countON >= 1) {
        // "ON" になっている証拠のキーを取得
        let activeEvidence = Object.keys(evidence).filter(
            (key) => evidence[key] === "ON"
        );

        // どれも含まれていないゴーストを取得
        let nonMatchingGhosts = Object.keys(GHOST).filter(
            (ghost) =>
                !activeEvidence.every((ev) =>
                    GHOST[ghost].EVIDENCE.includes(ev)
                )
        );
        // console.log("表示", matchingGhosts); // ["Oni", "Onryo"]
        console.log("除外", nonMatchingGhosts);

        //表示リストから除外
        disGhostList = disGhostList.filter(
            (ghost) => !nonMatchingGhosts.includes(ghost)
        );
    }
    if (countOFF >= 1) {
        // "OFF" になっている証拠のキーを取得
        let activeEvidence = Object.keys(evidence).filter(
            (key) => evidence[key] === "OFF"
        );

        // GHOSTのEVIDENCEに含まれているゴーストを取得
        let matchingGhosts = Object.keys(GHOST).filter((ghost) =>
            activeEvidence.some((ev) => GHOST[ghost].EVIDENCE.includes(ev))
        );

        console.log("除外", matchingGhosts); // ["Oni", "Onryo"]
        //表示リストから除外
        disGhostList = disGhostList.filter(
            (ghost) => !matchingGhosts.includes(ghost)
        );
    }

    //表示切替
    const ghostInfo = _GHOST_AREA.getElementsByTagName("div");
    // すべてのdivをチェックして表示/非表示を変更
    Array.from(ghostInfo).forEach((div) => {
        if (disGhostList.includes(div.id.slice(1))) {
            div.classList.remove("hidden"); // 配列AにIDが含まれていれば表示
        } else {
            div.classList.add("hidden"); // 含まれていなければ非表示
        }
    });

    //
    // disGhostListに含まれるゴーストのみを抽出
    let selectedGhosts = Object.keys(GHOST)
        .filter((ghost) => disGhostList.includes(ghost)) // disGhostListに含まれるゴーストをフィルタリング
        .reduce((result, ghost) => {
            result[ghost] = GHOST[ghost]; // GHOSTオブジェクトからそのゴーストを抽出
            return result;
        }, {});

    console.log("表示リスト", selectedGhosts);

    // evidence の "unknown" なキーを取得
    let unknownKeys = Object.keys(evidence).filter(
        (key) => evidence[key] === "unknown"
    );

    notInEvidenceList.forEach((el) => {
        document.getElementById(`_${el}`).classList.remove("off");
    });
    //  配列内に出現しない証拠のキーを取得
    notInEvidenceList = unknownKeys.filter(
        (key) =>
            !Object.values(selectedGhosts).some((ghost) =>
                ghost.EVIDENCE.includes(key)
            )
    );

    console.log("自動的にOFF", notInEvidenceList); // 結果: 出現しなかった証拠のリスト
    notInEvidenceList.forEach((el) => {
        document.getElementById(`_${el}`).classList.add("off");
    });

    _NUM_DIS.textContent = disGhostList.length;
};

let timer = null;
const stopWatch = (flg) => {
    if (flg) {
        //スタート
        let count = 0; // カウント用変数
        document.getElementById("_TIMER_DIS").textContent = "000";

        timer = setInterval(() => {
            count++; // 1ずつ加算
            document.getElementById("_TIMER_DIS").textContent = String(
                count
            ).padStart(3, "0"); // 表示を更新
            document.title = count;
            if (count == 999) {
                clearInterval(timer);
                _TIMER_BUTTON.classList.toggle("on");
            }
        }, 1000); // 1秒ごと
    } else {
        clearInterval(timer);
        document.title = "Survey Tool";
    }
};

const reset = () => {
    //エビデンスの選択をリセット
    Array.from(document.getElementsByClassName("evidence")).forEach((el) => {
        el.classList.remove("on");
        el.classList.remove("off");
    });
    //オブジェクトを初期化
    Object.keys(evidence).forEach((key) => {
        evidence[key] = "unknown";
    });
    //表示を更新
    ghostListUpdate();
    //Ghostの非表示を全て表示へ
    Array.from(document.getElementsByClassName("gInfo")).forEach((el) => {
        el.classList.remove("hide");
    });

    //Ebidenceタブへ遷移
    Array.from(document.getElementsByClassName("pages")).forEach((el) => {
        el.classList.add("hide");
    });
    document.getElementById(`_SURVEY_PAGE`).classList.remove("hide");

    //サイドメニュー隠す
    _SIDE_BUTTON.classList.toggle("on");
};

const longPress = {
    // プロパティ
    innerEl: document.getElementById("inner_circle"), //内側の円
    outerEl: document.getElementById("outer_circle"), //外側の円
    second: 1.5, //長押しの時間
    count: 0,
    timerId: 0,
    interval: 1,

    // 初期化処理
    init: function (param) {
        // イベントリスナー
        this.outerEl.addEventListener(
            "pointerdown",
            () => {
                this.start();
            },
            false
        );
        this.outerEl.addEventListener(
            "pointerup",
            () => {
                this.end();
            },
            false
        );
        this.outerEl.addEventListener(
            "pointerout",
            () => {
                this.end();
            },
            false
        );
        this.outerEl.oncontextmenu = () => {
            return false;
        };
    },

    // 長押し中の処理
    start: function () {
        this.timerId = setInterval(() => {
            this.count++;
            this.innerEl.style.width = this.count / this.second + "%";

            if (this.count / 100 === this.second) {
                reset();
                this.end();
            }
        }, this.interval);
    },

    // 長押し中断の処理
    end: function () {
        clearInterval(this.timerId);
        this.count = 0;
        this.innerEl.style.width = "0px";
    },
};
