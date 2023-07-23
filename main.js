loadSound("music", "sfx/dreamer.mp3");
loadSound("confirmation1", "sfx/confirmation1.ogg");
loadSound("confirmation2", "sfx/confirmation2.ogg");
loadSound("coins", "sfx/coins.ogg");

loadSprite("rock", "gfx/rock.png");
loadSprite("paper", "gfx/paper.png");
loadSprite("scissors", "gfx/scissors.png");

loadSprite("money", "gfx/money.png");

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
    const MAX_INFAMY = 100;
    const VICTORY_DIFFERENCE = 5;

    let score = 0;
    let leftPlayerScore = 0;
    let rightPlayerScore = 0;
    let roundNumber = 0;
    let calculatedResult = "";
    let infamy = 0;

    let leftPlayerBribed = 0;
    let rightPlayerBribed = 0;
    let leftPlayerBribeOffer = 0;
    let rightPlayerBribeOffer = 0;

    let correctDecisionsInARow = 0;

    let moneyGoals = [
        20,
        100,
        250,
        450,
        700,
        1000,
        1400,
        1900,
        2500,
        3500,
        5000,
        10000,
    ]

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
    const goalText = add([
        text("", {
            size: FONT_SIZE - 2,
            font: "pixelFont"
        }),
        pos(width() / 2, 5),
        color(0, 0, 0),
        anchor("top")
    ]);
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
    });
	const infamyMeter = add([
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
        let infamyWidth = Math.min(infamy, MAX_INFAMY);
        it.width = infamyWidth * (infamyMeter.width / MAX_INFAMY);
    });
    add([
        text(String(leftPlayerScore), {
            size: FONT_SIZE,
            font: "pixelFont"
        }),
        pos(80, height() / 2 + 80),
        color(0, 0, 0),
        anchor("center"),
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
        anchor("center"),
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
    const leftPlayerBribe = (bribe) => {
        destroyAll("leftPlayerBribe");
        leftPlayerBribeOffer = bribe;
        add([
            pos(80, height() / 2 + 105),
            sprite("money"),
            scale(0.06),
            area(),
            anchor("center"),
            "leftPlayerBribe",
            "playerBribe",
        ]);
        add([
            pos(95, height() / 2 + 105),
            text("Take $" + String(leftPlayerBribeOffer) + "\nbribe?", {
                size: FONT_SIZE - 4,
                font: "pixelFont"
            }),
            color(0, 0, 0),
            area(),
            anchor("left"),
            "leftPlayerBribe",
            "playerBribe",
        ]);
        onClick("leftPlayerBribe", () => {
            playSfx("coins");
            leftPlayerBribed = leftPlayerBribeOffer;
            infamy += Math.floor(leftPlayerBribeOffer / 2);
            destroyAll("leftPlayerBribe");
            leftPlayer("disguised");
        });
    }
    const rightPlayerBribe = (bribe) => {
        destroyAll("rightPlayerBribe");
        rightPlayerBribeOffer = bribe;
        add([
            pos(width() - 80, height() / 2 + 105),
            sprite("money"),
            scale(0.06),
            area(),
            anchor("center"),
            "rightPlayerBribe",
            "playerBribe",
        ]);
        add([
            pos(width() - 95, height() / 2 + 105),
            text("Take $" + String(rightPlayerBribeOffer) + "\nbribe?", {
                size: FONT_SIZE - 4,
                font: "pixelFont"
            }),
            color(0, 0, 0),
            area(),
            anchor("right"),
            "rightPlayerBribe",
            "playerBribe",
        ]);
        onClick("rightPlayerBribe", () => {
            playSfx("coins");
            rightPlayerBribed = rightPlayerBribeOffer;
            infamy += Math.floor(rightPlayerBribeOffer / 2);
            destroyAll("rightPlayerBribe");
            rightPlayer("disguised");
        });
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
        area(),
        anchor("center"),
        "secondaryText",
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
        roundNumber += 1;
        mainText.text = "Round " + roundNumber;
        leftPlayerBribed = 0;
        rightPlayerBribed = 0;
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
        secondaryText.text = "Decide who won";
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
        onClick("leftPlayerChoice", () => {
            if (secondaryText.text === "Decide who won") {
                decisionMade("left");
            }
        });
        onClick("rightPlayerChoice", () => {
            if (secondaryText.text === "Decide who won") {
                decisionMade("right");
            }
        });
        // Player reactions to the expected result
        if (calculatedResult === "right") {
            rightPlayer("smirk");
            if (rightPlayerScore > leftPlayerScore) {
                leftPlayer("grimace");
            } else {
                leftPlayer("worried");
            }
        } else if (calculatedResult === "left") {
            leftPlayer("smirk");
            if (leftPlayerScore > rightPlayerScore) {
                rightPlayer("grimace")
            } else {
                rightPlayer("worried");
            }
        } else {
            leftPlayer("neutral");
            rightPlayer("neutral");
        }
        // Bribes
        if (roundNumber > 2) {
            // Always bribe on round 3
            if (roundNumber === 3) {
                if (calculatedResult === "right") {
                    leftPlayerBribe(randi(5, 15));
                } else if (calculatedResult === "left") {
                    rightPlayerBribe(randi(5, 15)); 
                } else {
                    if (randi(0, 2) === 0) {
                        leftPlayerBribe(randi(5, 15));
                    } else {
                        rightPlayerBribe(randi(5, 15));
                    }
                }
            } else if (roundNumber < 5) {
                if (calculatedResult === "right") {
                    leftPlayerBribe(randi(5, 25));
                } else if (calculatedResult === "left") {
                    rightPlayerBribe(randi(5, 25));
                } else {
                    if (randi(0, 2) === 0) {
                        leftPlayerBribe(randi(5, 25));
                    } else {
                        rightPlayerBribe(randi(5, 25));
                    }
                }
            } else {
                const bribe1 = randi(5 + roundNumber, 50 + (roundNumber * 2));
                const bribe2 = randi(5 + roundNumber, 50 + (roundNumber * 2));
                const biggerBribe = Math.max(bribe1, bribe2);
                const smallerBribe = Math.min(bribe1, bribe2);
                if (calculatedResult === "right") {
                    leftPlayerBribe(biggerBribe);
                    rightPlayerBribe(smallerBribe);
                } else if (calculatedResult === "left") {
                    leftPlayerBribe(smallerBribe);
                    rightPlayerBribe(biggerBribe);
                } else {
                    leftPlayerBribe(randi(5 + roundNumber, 50 + (roundNumber * 2)));
                    rightPlayerBribe(randi(5 + roundNumber, 50 + (roundNumber * 2)));
                }
            }
        }
    };
    let decisionMade = (decision) => {
        if (decision === calculatedResult) {
            playSfx("confirmation2");
        } else {
            playSfx("confirmation1");
        }
        destroyAll("decisionLabel");
        destroyAll("playerBribe");
        secondaryText.text = "";
        // Player reactions, scores, and infamy to the decided result
        if (decision === "left") {
            leftPlayerScore += 1;
            if (calculatedResult === "left") {
                refereedCorrectly();
                leftPlayer("relieved");
                rightPlayer("pensive");                
            } else if (calculatedResult === "right") {
                infamy += 2;
                leftPlayer("laughing");
                rightPlayer("angry");
                if (leftPlayerBribed) infamy += Math.floor(leftPlayerBribed / 2);
            } else {
                infamy += 1;
                leftPlayer("relieved");
                rightPlayer("angry");
                if (leftPlayerBribed) infamy += Math.floor(leftPlayerBribed / 2);
            }
            if (leftPlayerBribed) {
                score += leftPlayerBribed;
            }
            if (rightPlayerBribed) {
                if (rightPlayerBribed && !leftPlayerBribed) {
                    rightPlayer("swearing");
                } else {
                    rightPlayer("enraged");
                }
            }
        } else if (decision === "right") {
            rightPlayerScore += 1;
            if (calculatedResult === "left") {
                infamy += 2;
                leftPlayer("angry");
                rightPlayer("laughing");
                if (rightPlayerBribed) infamy += Math.floor(rightPlayerBribed / 2);     
            } else if (calculatedResult === "right") {
                refereedCorrectly();
                leftPlayer("pensive");
                rightPlayer("relieved");
            } else {
                infamy += 1;
                leftPlayer("angry");
                rightPlayer("relieved");
                if (rightPlayerBribed) infamy += Math.floor(rightPlayerBribed / 2);
            }
            if (rightPlayerBribed) {
                score += rightPlayerBribed;                
            }
            if (leftPlayerBribed) {
                if (leftPlayerBribed && !rightPlayerBribed) {
                    leftPlayer("swearing");
                } else {
                    leftPlayer("enraged");
                }
            }
        } else {
            if (calculatedResult === "left") {
                infamy += 1;
                leftPlayer("pensive");
                rightPlayer("relieved");
                if (rightPlayerBribed) {
                    score += Math.ceil(rightPlayerBribed / 2);
                    infamy += Math.floor(rightPlayerBribed / 2);
                }             
            } else if (calculatedResult === "right") {
                infamy += 1;
                leftPlayer("relieved");
                rightPlayer("pensive");
                if (leftPlayerBribed) {
                    score += Math.ceil(leftPlayerBribed / 2);
                    infamy += Math.floor(leftPlayerBribed / 2);
                }
            } else {
                refereedCorrectly();
                leftPlayer("relieved");
                rightPlayer("relieved");
            }
        }
        if (decision != calculatedResult) {
            correctDecisionsInARow = 0;
        }
        wait(3, eventDecider())
    };
    let refereedCorrectly = () => {
        correctDecisionsInARow += 1;
        infamy = infamy > 0 ? infamy - (1 + correctDecisionsInARow) : 0;
        infamy = infamy < 0 ? 0 : infamy;
        if (correctDecisionsInARow >= 3) {
            score += 10;
            secondaryText.text = "Referee'd consistenly! +$10";
        } else {
            score += 5;
            secondaryText.text = "Referee'd correctly! +$5";
        }
    }
    let eventDecider = () => {
        wait(3, () => {
            if (infamy > MAX_INFAMY) {
                gameOverDisbarred();
            } else if (leftPlayerScore >= rightPlayerScore + VICTORY_DIFFERENCE) {
                gameOverVictory("Left");
            } else if (rightPlayerScore >= leftPlayerScore + VICTORY_DIFFERENCE) {
                gameOverVictory("Right");            
            } else if (roundNumber % 5 == 0 && score < moneyGoals[(roundNumber / 5) - 1]) {
                gameOverBroke();
            } else {
                let currentGoal = moneyGoals[Math.floor(roundNumber / 5)];
                let currentGoalRound = (Math.floor(roundNumber / 5) + 1) * 5;
                goalText.text = "Goal $" + currentGoal + " by Round " + currentGoalRound;
                startOfRound();
            }
        })
    }
    let gameOverDisbarred = () => {
        mainText.text = "You are disbarred for foul play";
        secondaryText.text = "Click to go back to menu"
        leftPlayer("spiral");
        rightPlayer("spiral");
        loop(1, () => {
            secondaryText.opacity = secondaryText.opacity == 1 ? 0 : 1;
        });
        onClick("secondaryText", () => { music.paused = true; go("menu", hiScore); })
    }
    let gameOverVictory = (player) => {
        mainText.text = player + " player has won";
        secondaryText.text = "Click to go back to menu"
        if (player === "Left") {
            leftPlayer("grinning");
            rightPlayer("frowning");
        } else {
            leftPlayer("frowning");
            rightPlayer("grinning");
        }
        loop(1, () => {
            secondaryText.opacity = secondaryText.opacity == 1 ? 0 : 1;
        });
        onClick("secondaryText", () => { music.paused = true; go("menu", hiScore); })
    }
    let gameOverBroke = () => {
        mainText.text = "You are disbarred for being too poor";
        secondaryText.text = "Click to go back to menu"
        leftPlayer("shocked");
        rightPlayer("shocked");
        loop(1, () => {
            secondaryText.opacity = secondaryText.opacity == 1 ? 0 : 1;
        });
        onClick("secondaryText", () => { music.paused = true; go("menu", hiScore); })
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
