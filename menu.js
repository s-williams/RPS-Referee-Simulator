loadFont("pixelFont", "fonts/PixelOperatorMono8.ttf");
loadSprite("referee", "gfx/referee.png");
loadSound("click", "sfx/click.ogg");

scene("menu", (hiScore = 0) => {
    // UI
    add([
        text("$" + String(0), {
            size: FONT_SIZE,
            font: "pixelFont"
        }),
        pos(width() - 5, 5),
        color(0, 0, 0),
        anchor("topright")
    ]);
    add([
        text("HI $" + String(hiScore), {
            size: FONT_SIZE,
            font: "pixelFont"
        }),
        pos(5, 5),
        color(0, 0, 0),
        anchor("topleft")
    ]);
    // Start text
    add([
        pos(width() / 2, 100),
        sprite("referee"),
        scale(0.8),
        anchor("center"),
    ]);
    add([
        text("RPS REFEREE SIMULATOR", {
            size: FONT_SIZE * 1.85,
            font: "pixelFont"
        }),
        pos(width() / 2, 200),
        color(0, 0, 0),
        anchor("center")
    ]);
    let startText = add([
        text("Click to Start", {
            size: FONT_SIZE,
            font: "pixelFont"
        }),
        pos(240, 260),
        anchor("center"),
        area(),
        color(0, 0, 0),
        "start",
    ]);
    onClick("start", () => { go("main", hiScore); });
    loop(1, () => {
        startText.opacity = startText.opacity == 1 ? 0 : 1;
    });
    // Credits
    add([
        text("Instructions", {
            size: FONT_SIZE,
            font: "pixelFont"
        }),
        pos(240, height() - 30),
        anchor("bot"),
        area(),
        color(0, 0, 0),
        "instructions"
    ]);
    onClick("instructions", () => { playSfx("click"); go("instructions", hiScore); });
    // Music and SFX mute buttons
    const musicText = add([
        text(musicMuted ? "Muted" : "Music", {
            size: FONT_SIZE,
            font: "pixelFont"
        }),
        pos(30, height() - 30),
        anchor("botleft"),
        area(),
        color(0, 0, 0),
        "musicText"
    ]);
    onClick("musicText", () => {
        toggleMusic();
        playSfx("click");
    });
    let toggleMusic = () => {
        musicMuted = !musicMuted;
        musicText.text = musicMuted ? "Muted" : "Music";
    }
    const sfxText = add([
        text(sfxMuted ? "Muted" : "SFX", {
            size: FONT_SIZE,
            font: "pixelFont"
        }),
        pos(width() - 30, height() - 30),
        anchor("botright"),
        area(),
        color(0, 0, 0),
        "sfxText"
    ]);
    onClick("sfxText", () => {
        toggleSfx();
        playSfx("click");
    });
    let toggleSfx = () => {
        sfxMuted = !sfxMuted;
        sfxText.text = sfxMuted ? "Muted" : "SFX";
    }

    onKeyPress("space", () => { go("main", hiScore); });
    onKeyPress("r", () => { go("main", hiScore); });
    onKeyPress("enter", () => { go("main", hiScore); });
    onKeyPress("escape", () => { go("menu", hiScore); });
    onKeyPress("1", () => { toggleMusic() });
    onKeyPress("2", () => { go('credits', hiScore); });
    onKeyPress("3", () => { toggleSfx(); });
});

scene("instructions", (hiScore = 0) => {
    // UI
    add([
        text("$" + String(0), {
            size: FONT_SIZE,
            font: "pixelFont"
        }),
        pos(width() - 5, 5),
        color(0, 0, 0),
        anchor("topright")
    ]);
    add([
        text("HI $" + String(hiScore), {
            size: FONT_SIZE,
            font: "pixelFont"
        }),
        pos(5, 5),
        color(0, 0, 0),
        anchor("topleft")
    ]);
    // Instructions
    add([
        text("Instructions:", {
            size: FONT_SIZE,
            font: "pixelFont",
            width: (width() - 10) / 2
        }),
        pos(5, 40),
        color(0, 0, 0),
        anchor("topleft")
    ]);
    add([
        text("You are the referee of a Rock Paper Scissors tournament. \n\nDecide who wins each round.\n\nThe tournament ends when one player gets five more points than the other. \n\nTake bribes. \n\nBe careful about being too corrupt. Watch your corruption meter carefully. \n\nControls: mouse only. \n\nGood luck.", {
            size: FONT_SIZE - 4,
            font: "pixelFont",
            width: (width() - 10) / 2
        }),
        pos(5, 40 + FONT_SIZE * 2),
        color(0, 0, 0),
        anchor("topleft")
    ]);
    // Credits
    add([
        text("Credits:", {
            size: FONT_SIZE,
            font: "pixelFont",
            width: (width() - 10) / 2,
            align: "right"
        }),
        pos(width() - 5, 40),
        color(0, 0, 0),
        anchor("topright")
    ]);
    add([
        text("Programming:\n\nswilliamsio\n\nhttps://www.swilliams.io", {
            size: FONT_SIZE - 4,
            font: "pixelFont",
            width: (width() - 10) / 2,
            align: "right"
        }),
        pos(width() - 5, 40 + FONT_SIZE * 2),
        color(0, 0, 0),
        anchor("topright"),
        area(),
        "swilliamsio"
    ]);
    onClick("swilliamsio", () => window.open("https://www.swilliams.io", '_blank'));
    add([
        text("Music:\n\nDreamer - Kevin MacLeod\n\n\https://incompetech.com", {
            size: FONT_SIZE - 4,
            font: "pixelFont",
            width: (width() - 10) / 2,
            align: "right"
        }),
        pos(width() - 5, 40 + FONT_SIZE * 7),
        color(0, 0, 0),
        anchor("topright"),
        area(),
        "MacLeod"
    ]);
    onClick("MacLeod", () => window.open("https://incompetech.com", '_blank'));
    add([
        text("Graphics:\n\nhttps://openmoji.org", {
            size: FONT_SIZE - 4,
            font: "pixelFont",
            width: (width() - 10) / 2,
            align: "right"
        }),
        pos(width() - 5, 40 + FONT_SIZE * 12),
        color(0, 0, 0),
        anchor("topright"),
        area(),
        "openmoji"
    ]);
    onClick("openmoji", () => window.open("https://openmoji.org", '_blank'));
    // Back
    add([
        text("Back", {
            size: FONT_SIZE,
            font: "pixelFont"
        }),
        pos(240, height() - 30),
        anchor("bot"),
        area(),
        color(0, 0, 0),
        "back"
    ]);
    onKeyPress("space", () => { go("main", hiScore); });
    onKeyPress("r", () => { go("main", hiScore); });
    onKeyPress("enter", () => { go("main", hiScore); });
    onKeyPress("escape", () => { go("menu", hiScore); })
    onKeyPress("2", () => { go('menu', hiScore); });
    onClick("back", () => { playSfx("click"); go("menu", hiScore); });

});

// Sound util
let playSfx = (sfx, volume, detune) => {
    volume = volume || 1.0;
    detune = detune || 0;
    if (!sfxMuted) {
        play(sfx, {
            volume: volume,
            detune: detune,
        });
    }
};

try {
    go("menu", localStorage ? localStorage.getItem('hiscore') || 0 : 0);
} catch {
    go("menu", 0);
}
