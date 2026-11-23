// Koordinat sprite [x,y,w,h] pada atlas.png (1536x1024, latar sudah dibuat transparan)
const ATLAS = {
    player: [35, 30, 145, 165],
    e_basic: [395, 205, 140, 145],
    e_fast: [710, 205, 165, 145],
    e_side: [0, 205, 205, 145],
    e_heavy: [205, 205, 175, 145],
    boss: [1050, 5, 486, 515],
    ast: [
        [15, 370, 140, 155],
        [185, 370, 145, 155],
        [355, 370, 150, 155],
        [525, 370, 150, 155],
        [690, 370, 165, 155],
        [880, 370, 160, 155]
    ],
    b_player: [60, 550, 55, 150],
    b_enemy: [585, 540, 110, 170],
    p_heart: [800, 555, 145, 145],
    p_shield: [1000, 555, 145, 150],
    p_rapid: [1190, 555, 140, 140],
    boom: [
        [55, 815, 80, 85],
        [200, 785, 150, 140],
        [415, 760, 180, 175],
        [660, 750, 210, 205],
        [920, 730, 265, 265],
        [1205, 715, 325, 285]
    ]
};
const IMG = new Image();
IMG.src = '../assets/sprites/atlas.png';
function spr(ctx, r, cx, cy, w, flip) {
    const h = w * r[3] / r[2];
    ctx.save();
    ctx.translate(cx, cy);
    if (flip)
        ctx.scale(1, -1);
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(IMG, r[0], r[1], r[2], r[3], -w / 2, -h / 2, w, h);
    ctx.restore();
}
