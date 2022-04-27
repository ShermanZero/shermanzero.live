<script>
  import JournalTitle from "../JournalTitle.svelte";
  import JournalLine from "../JournalLine.svelte";
  import JournalQuote from "../JournalQuote.svelte";

  let p1 =
    "It was nice to talk to you and chill today.  I don’t really feel like I’m worth your time and that’s a whole mental battle, but I know that if you didn’t want to spend time with me then you wouldn’t.  I enjoyed learning more about you, and it was really cool to see your books on witchcraft.  I hope someday you can teach me all about everything that interests you because I want to be more knowledgeable in those areas and better able to vibe with you.";
  let p2 =
    "The videos you shared with me of your kids melted my heart, they looked so happy and I’ve never seen a mom play ball with her kids before.  I thought that was amazing and made me wish I had kids to teach and play ball with.  I’m so sorry about your hands and I’m glad you’ll be able to get the help you need for them.  Your weed smelled good by the way hahah I was just vibing as much as awkward me can.  I was happy to just be there next to you and listen to you.  I didn’t have much to say I know, but I really just wanted to be there as your support for whatever you needed.  It was nice to laugh with you and like always, to see you smile.";
  let p3 =
    "I’m going to miss you a lot when you go to Arconic.  I don’t know if I’d ever see you again and that’s a painful thought.  Thank you for the amethyst pendant.  I don’t deserve anything, and accepting anything no matter how big or small is a hard thing for me to do.  I felt so bad and I will keep it safe until you want it back.";
  let p4 =
    "It really does mean a lot to me though, the gesture alone.  I have some plans for this page, and what I’m going to try and do is keep journal entries/letters like this from every day about our interactions so that I don’t forget, and maybe, hopefully so that you can have something to always look back through and remember our time together.  I can only hope that it may bring you some comfort and happiness.";

  let p5 =
    "I will probably expand on this idea more and more as time goes on, but that’s my intention for it now.  I also want to include little pictures scattered through, and at the end of the entry I want to put a quote that resonates with me.  All of this will hopefully become a little boost to you";

  let quote = "Things are never quite as scary when you’ve got a best friend";
</script>

<JournalTitle journalEntryDay="Apr. 26th, 2022" journalEntryTitle="A Moment in Time" />
<JournalLine paragraph={p1} />
<JournalLine paragraph={p2} />
<JournalLine paragraph={p3} imageSrc="/pngs/04262022_amethyst.jpg" imageAlt="amethyst pendant" />
<JournalLine paragraph={p4} />
<JournalLine paragraph={p5} />
<JournalQuote {quote} />
