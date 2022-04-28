<script>
  import JournalEntry from "../components/journal/entries/JournalEntry.svelte";

  const handler = () =>
    fetch("/.netlify/functions/journal-pull", {
      method: "GET",
      mode: "no-cors",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
      },
      redirect: "follow",
    })
      .then((r) => {
        r.json();
        console.log(r);
      })
      .then((j) => {
        console.log(j);
      });

  const paragraphs_04262022 = [
    "It was nice to talk to you and chill today.  I don’t really feel like I’m worth your time and that’s a whole mental battle, but I know that if you didn’t want to spend time with me then you wouldn’t.  I enjoyed learning more about you, and it was really cool to see your books on witchcraft.  I hope someday you can teach me all about everything that interests you because I want to be more knowledgeable in those areas and better able to vibe with you.",
    "The videos you shared with me of your kids melted my heart, they looked so happy and I’ve never seen a mom play ball with her kids before.  I thought that was amazing and made me wish I had kids to teach and play ball with.  I’m so sorry about your hands and I’m glad you’ll be able to get the help you need for them.  Your weed smelled good by the way hahah I was just vibing as much as awkward me can.  I was happy to just be there next to you and listen to you.  I didn’t have much to say I know, but I really just wanted to be there as your support for whatever you needed.  It was nice to laugh with you and like always, to see you smile.",
    "I’m going to miss you a lot when you go to Arconic.  I don’t know if I’d ever see you again and that’s a painful thought.  Thank you for the amethyst pendant.  I don’t deserve anything, and accepting anything no matter how big or small is a hard thing for me to do.  I felt so bad and I will keep it safe until you want it back.",
    "It really does mean a lot to me though, the gesture alone.  I have some plans for this page, and what I’m going to try and do is keep journal entries/letters like this from every day about our interactions so that I don’t forget, and maybe, hopefully so that you can have something to always look back through and remember our time together.  I can only hope that it may bring you some comfort and happiness.",
    "I will probably expand on this idea more and more as time goes on, but that’s my intention for it now.  I also want to include little pictures scattered through, and at the end of the entry I want to put a quote that resonates with me.  All of this will hopefully become a little boost to you",
  ];
  const images_04262022 = [null, null, "/pngs/04262022_amethyst.jpg"];

  const paragraphs_04272022 = [
    "Getting 5 hours of sleep and waking up at 5:30 wasn't really what I was planning on today, but I'm glad it happened so I could chat with you before you went to work.  Although, you did give me a craving for some iced coffee so rip me.  That's okay, I have some arnold palmer cooling down in the freezer that will be my best friend today.  All the meals you shared with me looked fucking amazing.  I have such a hard time expressing myself in person but I am constantly impressed/awed by you.  Raw oatmeal is where it's at.  Quaker's brown sugar and cinnamon man, used to live off of that as a kid.",

    "My package is out for delivery so I'm hoping I'll have an excuse to stop by work before you leave today and give the thing to you.  I don't know if it'll end up working well or not, but I hope it does and that we both can find some use for it.  There's four to the pack I ordered so we're both getting two.  I'm exhausted so I might just go back to bed, but alternatively I could just play farming simulator.  I feel like such a weird fucking person.  I present myself as a hardass but I'm a fucking softie, I tell people about my nerdy shit but I'm an athlete and a redneck to an extent.  I find so many things interesting and I like to explore.  I'm always down to try anything and I love to learn, and I imagine this extremely large circle around me containing so many interests that aren't usually associated with each other.  For example, Overwatch is my main game and it's a competitive PvP fps, but then I'll turn right around and vibe tending to a virtual farm or driving trucks in Truck Simulator.",

    "There's so much weird shit to me that I don't even understand.  It's nice though, to be able to relate to people because I'm not stuck in a box or stuck in my ways and I'm just a curious person really.  Most of my knowledge about anything is self-taught, even the nine years I've spent programming has been predominently my own motivation and countless hours slaving away into my own research.  My musical side is almost all self-taught, but I did take piano and guitar lessons when I was a little kid so that really just helps me be able to write faster because I know chords and techniques and a little theory and whatnot.",

    "Thank you for coming over after work.  I was secretly hoping to see you and I may or may not have dragged myself out of bed at 4 to clean myself up in case you had offered.  I hope the alkaline filters help!  If they do they aren't too expensive, and they're supposed to last for quite a few gallons.  I have another surprise for you eventually, theoretically Friday but who actually knows when.  Either way, I'm excited to give because I really want to help push you into a better place and to yourself again.",

    "I wanted to tell you today that when I first saw you I thought you were cute too but my constant fear of losing you to dumb shit prevents me from complimenting you privately 99% of the time.  Knowing me it would come out wrong and I'd just sit there feeling awkard as fuck.  You keep doing you though because you always look good and you deserve to feel confident in yourself.",

    "I probably won't tell you that I published this.  It wasn't my intention to be like 'HEY CHECK IT OUT I WROTE MORE HEARTFELT SHIT TO/ABOUT YOU' every time I do, so this will just exist for whenever you see it.  As I'm writing this your boyfriend is probably home and I doubt I'll hear from you much the rest of the night.  It's been pretty fun to program this though.  I'm working towards making it more efficient and optimized and whatnot, and I have to continue writing more and more logic behind the scenes to make room for what I have planned.  For example before today there was no dropdown functionality programmed into journal entries, so that was like my little project for today.  I'm sure there are lots of bugs and whatnot, but as long as the experience is fairly smooth then it's not a pressing worry.",

    "Anyway, I hope your night goes well and your boyfriend treats you the way you deserve to be treated.  I hope he turns his ways around and gives you the happiness you deserve.  I'll tell you every day but I feel for you and I hate seeing you so lost.  You're in a really hard position and I don't have the answers for you, but the only advice I can offer is to always put yourself first.  In relationships, out of relationships, you should and deserve to come first.",
  ];
  const images_04272022 = [
    "/pngs/04272022_food01.jpg",
    "/pngs/04272022_food02.jpg",
    null,
    null,
    null,
    "/pngs/04272022_sameday_samebullshit.png",
  ];
</script>

<h1>Linzy's Hideout</h1>

<JournalEntry
  date="Apr. 27th, 2022"
  title="Another Dime"
  paragraphs={paragraphs_04272022}
  images={images_04272022}
  quote="Friendship isn't a big thing, it's a million little things"
/>
<JournalEntry
  date="Apr. 26th, 2022"
  title="A Moment in Time"
  paragraphs={paragraphs_04262022}
  images={images_04262022}
  quote="Things are never quite as scary when you’ve got a best friend"
/>

<style>
  h1 {
    text-align: center;
    font-family: "Square Peg", cursive;
    font-size: 4em;
    font-weight: 200;
    color: whitesmoke;
    margin-top: 4px;
  }
</style>
