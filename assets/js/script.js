var colors = [
    {
        "colorname": "Blue",
        "colorcode": "#0600e9"
    },
    {
        "colorname": "Orange",
        "colorcode": "#e57b2a"
    },
    {
        "colorname": "Green",
        "colorcode": "#4ef130"
    },
    {
        "colorname": "Red",
        "colorcode": "#e71b25"
    },
    {
        "colorname": "Purple",
        "colorcode": "#f925fa"
    },
    {
        "colorname": "Red",
        "colorcode": "#e71b25"
    },
    {
        "colorname": "Purple",
        "colorcode": "#f925fa"
    },
    {
        "colorname": "Blue",
        "colorcode": "#0600e9"
    },
    {
        "colorname": "Orange",
        "colorcode": "#e57b2a"
    },
    {
        "colorname": "Green",
        "colorcode": "#4ef130"
    },
    {
        "colorname": "Blue",
        "colorcode": "#0600e9"
    },
    {
        "colorname": "Orange",
        "colorcode": "#e57b2a"
    },
    {
        "colorname": "Green",
        "colorcode": "#4ef130"
    },
    {
        "colorname": "Red",
        "colorcode": "#e71b25"
    },
    {
        "colorname": "Purple",
        "colorcode": "#f925fa"
    },
    {
        "colorname": "Red",
        "colorcode": "#e71b25"
    },
    {
        "colorname": "Purple",
        "colorcode": "#f925fa"
    },
    {
        "colorname": "Blue",
        "colorcode": "#0600e9"
    },
    {
        "colorname": "Orange",
        "colorcode": "#e57b2a"
    },
    {
        "colorname": "Green",
        "colorcode": "#4ef130"
    },
]


localStorage.setItem('stage', 1);
var results = [];
var i = 0;

function displayWord() {
    $(".test").show();
    $(".welcome").hide();
    $(".test_screen").show();
    $(".stage2_alert").hide();
    console.log(typeof (localStorage.getItem('stage')));
    var color = colors[i].colorcode;
    if (parseInt(localStorage.getItem('stage')) == 2) {
        color = getColor(i);
    }
    $("#wordandcolor").html("<span style='color:" + color + "'>" + colors[i].colorname + "</span>");


    var action = document.getElementById("action");
    var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
    var recognition = new SpeechRecognition();

    recognition.onstart = function () {
        action.innerHTML = '<div class="spinner"> <div></div> <div></div> <div></div> <div></div> </div>';
    };

    recognition.onspeechend = function () {
        action.innerHTML = "<small> </small>";
        recognition.stop();
    }

    recognition.onresult = function (event) {
        var transcript = event.results[0][0].transcript;
        var confidence = event.results[0][0].confidence;



        if (transcript.toUpperCase() === colors[i].colorname.toUpperCase()) {
            console.log("Correct");
            results.push({ result: 1, stage: localStorage.getItem('stage'), ml_confidence: confidence, transcript: transcript });
        } else {
            console.log("Wrong");
            results.push({ result: 0, stage: localStorage.getItem('stage'), ml_confidence: confidence, transcript: transcript });
        }


        if (i + 1 < colors.length) {
            i++;
            displayWord();
        } else {
            if (i + 1 >= colors.length) {

                if (parseInt(localStorage.getItem('stage')) == 2) {
                    calculateScore();
                    $(".stage2_alert").hide();
                    $(".test_screen").hide();
                    $(".result").show();
                    localStorage.setItem('stage', 1);
                } else {
                    console.log("Stage 1 complete");

                    $(".stage2_alert").show();
                    $(".test_screen").hide();
                    console.log(results);
                    i -= i;
                    localStorage.setItem('stage', 2);
                }

                //



            }

        }
    };



    recognition.start();

}

function getColor(index) {
    var currarr = colors;
    currarr.slice(index, 1);

    var min = 0;
    var max = colors.length - 1;

    var randomindex = Math.floor(Math.random() * (max - min + 1) + min);

    return colors[randomindex].colorcode;
}

function calculateScore() {
    totalScore = colors.length;
    stage1 = 0;
    stage2 = 0;

    total_per_ten = 10;

    strong_threshold = 3;
    avg_threshold = 5;
    normal_threshold = 7;
    weak_threshold = 9;

    results.forEach(function (item) {
        if (item.result == 1) {
            if (parseInt(item.stage) == 1) {
                stage1 += 1;
            } else if (parseInt(item.stage) == 2) {
                stage2 += 1;
            }
        }
    });

    var stage1score = (stage1 / totalScore * 100) / total_per_ten;
    var stage2score = (stage1 / totalScore * 100) / total_per_ten;

    if (stage1score > 7) {
        //if stage 1 passes 70% the stage 2 test is valid
        $(".score").html(stage2score + "/" + total_per_ten);
        if (stage2score <= strong_threshold) {
            $(".score_message").html("Your results indicate a very high probability of ADHD or related symptoms. Please confirm with your doctor.");
        } else if (stage2score <= avg_threshold) {
            $(".score_message").html("Your results indicate a high probability of ADHD or related symptoms. Please confirm with your doctor.");
        } else if (stage2score <= normal_threshold) {
            $(".score_message").html("Your results indicate a small probability of ADHD or related symptoms. Please confirm with your doctor.");
        } else if (stage2score <= weak_threshold) {
            $(".score_message").html("Your results indicate a weak probability of ADHD or related symptoms. Please confirm with your doctor.");
        } else {
            $(".score_message").html("An error was encountered. Please try again after a few minutes.");
        }
    } else {
        $(".score").html(0 + "/" + 0);
        $(".score_message").html("An error was encountered. Please try again after a few minutes.");
    }
}


function startOver() {
    $(".welcome").show();
    $(".stage2_alert").hide();
    $(".test_screen").hide();
    $(".result").hide();
    $(".test").hide();
    i -= i;
    localStorage.setItem('stage', 1);
}