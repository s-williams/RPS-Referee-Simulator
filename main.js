loadSound("music", "sfx/dreamer.mp3");

loadSprite("rock", "gfx/rock.png");
loadSprite("paper", "gfx/paper.png");
loadSprite("scissors", "gfx/scissors.png");

loadSprite("angry", "gfx/angry.png");
loadSprite("anguished", "gfx/anguished.png");
loadSprite("astonished", "gfx/astonished.png");
loadSprite("confounded", "gfx/confounded.png");
loadSprite("disappointed", "gfx/disappointed.png");
loadSprite("disguised", "gfx/disguised.png");
loadSprite("downcast", "gfx/downcast.png");
loadSprite("enraged", "gfx/enraged.png");
loadSprite("frowning", "gfx/frowning.png");
loadSprite("grimace", "gfx/grimace.png");
loadSprite("grinning", "gfx/grinning.png");
loadSprite("laughing", "gfx/laughing.png");
loadSprite("neutral", "gfx/neutral.png");
loadSprite("pensive", "gfx/pensive.png");
loadSprite("relieved", "gfx/relieved.png");
loadSprite("shocked", "gfx/shocked.png");
loadSprite("smirk", "gfx/smirk.png");
loadSprite("spiral", "gfx/spiral.png");
loadSprite("steaming", "gfx/steaming.png");
loadSprite("swearing", "gfx/swearing.png");
loadSprite("thinking", "gfx/thinking.png");
loadSprite("unamused", "gfx/unamused.png");
loadSprite("worried", "gfx/worried.png");

scene("main", (hiScore = 0) => {
    var score = 0;
    var leftPlayerScore = 0;
    var rightPlayerScore = 0;
    var roundNumber = 1;
    var calculatedResult = "";
    var infamy = 0;

    // Music
    const music = play("music", {
        volume: musicMuted ? 0 : 0.8,
        loop: true
    });

    // UI
    add([
        text("$" + String(score), {
            size: FONT_SIZE,
            font: "pixelFont"
        }),
        pos(width() - 5, 5),
        color(0, 0, 0),
        anchor("topright"),
        "scoreLabel",
    ]);
    onUpdate("scoreLabel", (it) => {
        it.text = "$" + String(score);
    });
    add([
        text("HI $" + String(hiScore), {
            size: FONT_SIZE,
            font: "pixelFont"
        }),
        pos(5, 5),
        color(0, 0, 0),
        anchor("topleft"),
        "hiScoreLabel",
    ]);
    onUpdate("hiScoreLabel", (it) => {
        if (score > hiScore) {
            hiScore = score;
            try {
                localStorage.setItem('hiscore', hiScore);
            } catch { }
        }
        it.text = "HI $" + String(hiScore);
    })
	add([
        pos(width() / 2, height() * 0.9),
        rect(width() * 0.8, 20),
        outline(2),
        area(),
        anchor("center"),
        "infamymeter",
    ]);
	add([
        pos(width() / 2 - (width() * 0.8) / 2, height() * 0.9),
        rect(infamy, 20),
        outline(2),
        area(),
        color(255, 0, 0),
        anchor("left"),
        "infamymeter",
        "infamyMeasure",
    ]);
    onUpdate("infamyMeasure", (it) => {
        it.width = infamy
    })
    add([
        text(String(leftPlayerScore), {
            size: FONT_SIZE,
            font: "pixelFont"
        }),
        pos(80, height() / 2 + 80),
        color(0, 0, 0),
        anchor("botleft"),
        "leftPlayerScore",
    ]);
    onUpdate("leftPlayerScore", (it) => {
        it.text = String(leftPlayerScore);
    });
    add([
        text(String(rightPlayerScore), {
            size: FONT_SIZE,
            font: "pixelFont"
        }),
        pos(width() - 80, height() / 2 + 80),
        color(0, 0, 0),
        anchor("botright"),
        "rightPlayerScore",
    ]);
    onUpdate("rightPlayerScore", (it) => {
        it.text = String(rightPlayerScore);
    });
    const leftPlayer = (emoji) => {
        destroyAll("leftPlayer");
        add([
            pos(80, height() / 2),
            sprite(emoji),
            scale(0.2),
            area(),
            anchor("center"),
            "leftPlayer",
        ]);
    }
    const rightPlayer = (emoji) => {
        destroyAll("rightPlayer");
        add([
            pos(width() - 80, height() / 2),
            sprite(emoji),
            scale(0.2),
            area(),
            anchor("center"),
            "rightPlayer",
        ]);
    }
    const leftPlayerChoice = (choice) => {
        destroyAll("leftPlayerChoice");
        add([
            pos(160, height() / 2),
            sprite(choice),
            area(),
            anchor("center"),
            "leftPlayerChoice",
            "playerChoice",
        ]);
    }
    const rightPlayerChoice = (choice) => {
        destroyAll("rightPlayerChoice");
        add([
            pos(width() - 160, height() / 2),
            sprite(choice),
            area(),
            anchor("center"),
            "rightPlayerChoice",
            "playerChoice",
        ]);
    }
    const mainText = add([
        text("Welcome", {
            size: FONT_SIZE,
            font: "pixelFont"
        }),
        pos(width() / 2, height() / 4),
        color(0, 0, 0),
        anchor("center")
    ]);
    const secondaryText = add([
        text("", {
            size: FONT_SIZE,
            font: "pixelFont"
        }),
        pos(width() / 2, height() / 4 + FONT_SIZE * 2),
        color(0, 0, 0),
        anchor("center")
    ]);

    // Returns left, right, draw depending on who should win the game
    let calculateResult = (leftChoice, rightChoice) => {
        if (leftChoice === "rock" && rightChoice === "paper") return "right";
        else if (leftChoice === "rock" && rightChoice === "scissors") return "left";
        else if (leftChoice === "paper" && rightChoice === "scissors") return "right";
        else if (leftChoice === "paper" && rightChoice === "rock") return "left";
        else if (leftChoice === "scissors" && rightChoice === "rock") return "right";
        else if (leftChoice === "scissors" && rightChoice === "paper") return "left";
        else return "draw";
    }

    // Loop
    let startOfRound = () => {
        mainText.text = "Round " + roundNumber;
        leftPlayer("thinking");
        rightPlayer("thinking");
        destroyAll("playerChoice");

        const leftPlayerMove = choose(["rock", "paper", "scissors"]);
        const rightPlayerMove = choose(["rock", "paper", "scissors"]);
        calculatedResult = calculateResult(leftPlayerMove, rightPlayerMove);
        secondaryText.text = ""
        wait(1, () => {
            secondaryText.text = 3
            wait(1, () => {
                secondaryText.text = 2
                wait(1, () => {
                    secondaryText.text = 1
                    wait(1, () => {
                        secondaryText.text = ""
                        leftPlayerChoice(leftPlayerMove);
                        rightPlayerChoice(rightPlayerMove);
                        decideWhoWon();
                    })
                })
            })            
        })
    };
    let decideWhoWon = () => {
        secondaryText.text = "Decide who won"
        const textOffset = 80;
        add([
            text("Left", {
                size: FONT_SIZE,
                font: "pixelFont"
            }),
            pos(width() / 2 - textOffset, height() / 4 + FONT_SIZE * 4),
            color(0, 0, 0),
            area(),
            anchor("center"),
            "leftLabel",
            "decisionLabel",
        ]);
        add([
            text("Draw", {
                size: FONT_SIZE,
                font: "pixelFont"
            }),
            pos(width() / 2, height() / 4 + FONT_SIZE * 4),
            color(0, 0, 0),
            area(),
            anchor("center"),
            "drawLabel",
            "decisionLabel",
        ]);
        add([
            text("Right", {
                size: FONT_SIZE,
                font: "pixelFont"
            }),
            pos(width() / 2 + textOffset, height() / 4 + FONT_SIZE * 4),
            color(0, 0, 0),
            area(),
            anchor("center"),
            "rightLabel",
            "decisionLabel",
        ]);
        onClick("leftLabel", () => {
            decisionMade("left");
        });
        onClick("drawLabel", () => {
            decisionMade("draw");
        });
        onClick("rightLabel", () => {
            decisionMade("right");
        });

        // Player reactions to the expected result
        if (calculatedResult === "right") {
            leftPlayer("grimace");
            rightPlayer("smirk");
        } else if (calculatedResult === "left") {
            leftPlayer("smirk");
            rightPlayer("grimace");
        } else {
            leftPlayer("neutral");
            rightPlayer("neutral");
        }
    };
    let decisionMade = (decision) => {
        destroyAll("decisionLabel");
        secondaryText.text = "";
        if (decision === "left") {
            leftPlayerScore += 1;
            if (calculatedResult === "left") {
                infamy = infamy > 0 ? infamy - 1 : 0;
                score += 5;
                secondaryText.text = "Referee'd correctly! +$5"
                leftPlayer("relieved");
                rightPlayer("pensive");                
            } else if (calculatedResult === "right") {
                infamy += 2;
                leftPlayer("laughing");
                rightPlayer("angry");
            } else {
                infamy += 1;
                leftPlayer("relieved");
                rightPlayer("angry");
            }
        } else if (decision === "right") {
            rightPlayerScore += 1;
            if (calculatedResult === "left") {
                infamy += 2;
                leftPlayer("angry");
                rightPlayer("laughing");                
            } else if (calculatedResult === "right") {
                infamy = infamy > 0 ? infamy - 1 : 0;
                score += 5;
                secondaryText.text = "Referee'd correctly! +$5"
                leftPlayer("pensive");
                rightPlayer("relieved");
            } else {
                infamy += 1;
                leftPlayer("angry");
                rightPlayer("relieved");
            }
        } else {
            if (calculatedResult === "left") {
                infamy += 1;
                leftPlayer("pensive");
                rightPlayer("relieved");                
            } else if (calculatedResult === "right") {
                infamy += 1;
                leftPlayer("relieved");
                rightPlayer("pensive");
            } else {
                infamy = infamy > 0 ? infamy - 1 : 0;
                score += 5;
                secondaryText.text = "Referee'd correctly! +$5"
                leftPlayer("neutral");
                rightPlayer("neutral");
            }
        }
        wait(3, eventDecider())
    };
    let eventDecider = () => {
        if (infamy > 200) {
            gameOver();
        } else {
            roundNumber += 1;
            wait(3, () => {
                startOfRound();
            })
        }
    }
    let gameOver = () => {
        mainText.text = "You have been disbarred for foul play";
        secondaryText.text = "Press ESC to go back to menu"
        leftPlayer("spiral");
        rightPlayer("spiral");
        loop(1, () => {
            secondaryText.opacity = secondaryText.opacity == 1 ? 0 : 1;
        })
    }

    // Controls
    onKeyDown("r", () => { music.paused = true; go("menu", hiScore); });
    onKeyDown("escape", () => { music.paused = true; go("menu", hiScore); });

    // Start
    leftPlayer("grinning");
    rightPlayer("grinning");
    wait(3, () => {
        startOfRound();
    })
})