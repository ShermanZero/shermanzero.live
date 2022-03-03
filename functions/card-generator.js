const Jimp = require("jimp");
const fs = require('fs').promises;

const cardsToGenerate     = 8;

let IMAGE = null;
let FONT = null;
let CIRCLE = null;

let cards = [];

const generateDescriptor = async() => {
  const data = await fs.readFile("./lib/json/descriptors.json", "utf8");
  const json = JSON.parse(data);

  let random = Math.floor(Math.random() * json.length);
  return json[random];
}

const generateAlignments = async() => {
  const data = await fs.readFile("./lib/json/alignments.json", "utf8");
  const json = JSON.parse(data);

  let random1 = Math.floor(Math.random() * json.length);
  let random2 = random1;

  while(random2 == random1) {
    random2 = Math.floor(Math.random() * json.length);
  }

  return [json[random1], json[random2]];
}

const generateQuestions = async(numQuestions) => {
  const data = await fs.readFile("./lib/json/questions.json", "utf8");
  const json = JSON.parse(data);

  let asked = [];

  for(let i = 0; i < numQuestions; i++) {
    let random = -1;
    while(asked.includes(json[random]) || random == -1) {
      random = Math.floor(Math.random() * json.length);
    }

    asked.push(json[random]);
  }

  return asked;
}

const generateCard = async(image, useRandomPoints = false) => {
  let startX = 442;
  let startY = 288;

  let maxWidth = 340;
  let maxHeight = 30;

  let lineHeight = 39;

  let randRNG = Math.random()*2+"";
  randRNG = "x"+randRNG.substring(0, randRNG.indexOf(".")+3);

  //print the random rng multiplier
  image.print(
    FONT,
    325,
    465,
    {
      text: randRNG,
      alignmentX: Jimp.HORIZONTAL_ALIGN_LEFT,
      alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE
    },
    40,
    40
  );

  //print a random descriptor
  const descriptor = await generateDescriptor();
  console.log("descriptor: " + descriptor);

  image.print(
    FONT,
    320,
    25,
    {
      text: descriptor.toUpperCase(),
      alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
      alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE
    },
    400,
    80
  );


  //print a random alignment
  const alignmentPresets = await generateAlignments();
  const alignment1 = alignmentPresets[0];
  const alignment2 = alignmentPresets[1];

  console.log("alignmentPresets: " + alignmentPresets);
  console.log("alignment1: " + alignment1);
  console.log("alignment2: " + alignment2);

  for(let i = 0; i < 2; i++) {
    image.print(
      FONT,
      225,
      300 + (i * lineHeight),
      {
        text: i == 0 ? alignment1.toUpperCase() : alignment2.toUpperCase(),
        alignmentX: Jimp.HORIZONTAL_ALIGN_LEFT,
        alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE
      },
      maxWidth,
      maxHeight
    );

    image.blit(CIRCLE, 325, 300 + (i * lineHeight));

    image.print(
      FONT,
      360,
      300 + (i * lineHeight),
      {
        text: "+"+Math.ceil(Math.random()*3),
        alignmentX: Jimp.HORIZONTAL_ALIGN_LEFT,
        alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE
      },
      60,
      30
    );
  }

  //prints/generates random prompts/questions
  const questionPresets = await generateQuestions(6);

  for(let i = 0; i < 6; i++) {
    let question = questionPresets[i];

    if(useRandomPoints) {
      question.p = Math.ceil(Math.random()*5);
    }

    console.log("  populating question: [" + question.q +"] worth " + question.p +" points");

    let x = startX;
    let y = startY + (i * lineHeight);

    image.blit(CIRCLE, x, y);

    image.print(
      FONT,
      x + 38,
      y,
      {
        text: question.q.toUpperCase(),
        alignmentX: Jimp.HORIZONTAL_ALIGN_LEFT,
        alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE
      },
      maxWidth,
      maxHeight
    );

    image.print(
      FONT,
      x,
      y,
      {
        text: "+"+question.p,
        alignmentX: Jimp.HORIZONTAL_ALIGN_RIGHT,
        alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE
      },
      maxWidth,
      maxHeight
    );
  }

  cards.push(image);
}

const writePrint = () => {
  const c_white = 0xFFFFFFFF;
  const c_black = 0x000000FF;

  const letterWidth = 615;
  const letterHeight = 855;

  const cardsPerRow = 2;
  const cardPadding = 5;

  const cardWidth = letterWidth/cardsPerRow - cardPadding;
  const cardHeight = 208;

  const offset = cardPadding/2;

  console.log("\ncreating output image...");
  let outputImage = new Jimp(letterWidth, letterHeight, c_white);
  console.log("done");

  console.log("\ndrawing cards...");
  for(let i = 0; i < cards.length; i++) {
    let yPos = Math.floor(i/cardsPerRow) * cardHeight + offset;
    let xPos = (i%cardsPerRow) * cardWidth + (cardPadding * (i%cardsPerRow)) + offset;

    let card = cards[i];
    card.resize(cardWidth, Jimp.AUTO);
    outputImage.blit(card, xPos, yPos);
  }
  console.log("done");

  console.log("\ndrawing borders...");
  for(let i = 0; i <= cardsToGenerate/cardsPerRow; i++) {

    //line thickness
    for(let j = 0; j < cardPadding; j++) {

      //draw vertical borders
      for(let k = 0; k < cardHeight * (cards.length/cardsPerRow); k++) {
        let xPos = (i * cardWidth) + (i * cardPadding) - cardPadding/2 + j;
        let yPos = k;

        outputImage.setPixelColor(c_black, xPos, yPos)
      }

      //draw horizontal borders
      for(let k = 0; k < letterWidth; k++) {
        let xPos = k;
        let yPos = i * cardHeight - cardPadding + (j + offset);

        outputImage.setPixelColor(c_black, xPos, yPos)
      }
    }
  }
  console.log("done");
  cards = [];

  return outputImage;
}

const checkLoaded = () => {
  if(FONT == null || IMAGE == null || CIRCLE == null) throw "all assets not loaded";
  loaded = true;

  console.log("!all loaded!");
}

const generateCards = async() => {
  console.log("Generating " + cardsToGenerate + " cards...");

  console.log("\npopulating cards...");
  for(let i = 0; i < cardsToGenerate; i++) {
    console.log("\n  card [" + i + "]...");

    let clone = IMAGE.clone();
    await generateCard(clone, true);
    console.log("  done");
  }
  console.log("done");

  let outputImage = writePrint();
  let outputData = null;

  outputImage.getBase64(Jimp.AUTO, (err, base64) => {
    if(err) throw err;
    outputData = base64;
  });

  return outputData;
}

exports.handler = async (event, context) => {
  await Jimp.read("./lib/imgs/template.png").then((img) => { IMAGE = img; console.log("template image loaded"); });
  await Jimp.read("./lib/imgs/circle.png").then((img) => { CIRCLE = img; console.log("circle image loaded"); });
  await Jimp.loadFont("./lib/fonts/font_24.fnt").then((font) => { FONT = font; console.log("font loaded"); });

  checkLoaded();

  const outputData = await generateCards();

  return {
    statusCode: 200,
    body: JSON.stringify({ data: outputData })
  };
};