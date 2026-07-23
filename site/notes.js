// Speaker notes — one entry per slide, 0-indexed.
// In Izzy's voice — edit freely.
window.SPEAKER_NOTES = [
  // 1: Title
  `Welcome to our data benchmark, where everything's made up and the points don't matter... that's right, the points are just like me.`,

  // 2: Author
  `My name is Izzy, I do AI research at Hex, an AI analytics platform.

Most of my work orbits around trying to get LLMs to do analytics and data science tasks correctly, which is a surprisingly difficult challenge.

I spend a lot of my time on evals and experimentation. And lately, every time I look at a new public benchmark for data, I'm struck by the same thing.`,

  // 3: Drew Carey
  `[Image is up with "Every time I look at a new public benchmark for data..." above. Beat.]

[Advance → "...I'm struck by the same thing" appears below. Beat.]

[Advance to next slide for the punchline.]`,

  // 4: made up / points don't matter
  `Everything's made up. The points don't matter.

Today I'm going to convince you that as an industry, we have no idea what the fuck we're doing when it comes to evaluating agents on analytics. And then we'll talk about some cool stuff that might not be quite as made up.`,

  // 5: Levelset (Tom Gauld)
  `Quick levelset.

I'm going to poke holes in a lot of publicly available benchmarks. People worked on those and were brave enough to publish them. I'm grateful.

But what we do at Hex is literally just as made up — internal evals, bespoke dumpster fire. I'm not crowing about being smarter. I'm drilling into the actual reality behind the top-line numbers.`,

  // 6: ADE-bench shoutout
  `Quick shoutout — later today, Benn Stancil and Jason Ganz are unveiling their data benchmark, ADE-bench, which is surely not totally made up and where I'm positive the points all matter. Go see their talk, I'll be there too.

[Click] OK maybe their benchmark is a little tiny bit made up and the points might not matter — but hey, join the club. In all seriousness it looks like a great benchmark that tries to escape some of these same traps.`,

  // 7: Thesis
  `Even if everything's made up, we can still hold ourselves to a higher standard on benchmarking.`,

  // 7: Section I — frontier benchmarks
  `Before we dive into analytics, what does frontier LLM evaluation actually look like today? Some random examples.`,

  // 8: ProgramBench
  `ProgramBench, last week. Rebuild common codebases from scratch — no internet, just docs. ffmpeg, SQLite, PHP.

[On click] SQLite is 155k lines of code, validated by 92 million lines of test code.

Models fail. But this is an eval that appropriately tests real-world frontier behavior.`,

  // 9: Vending-Bench
  `Andon Labs. 365-day simulation, vending machine business, open-ended remit, measure money made.`,

  // 10: Andon Market
  `Follow-up — they opened a literal storefront in Cow Hollow and let Claude run it. Yes, really.`,

  // 11: BrowseComp
  `OpenAI's BrowseComp. "Simple yet challenging" web search questions. Only 30% solvable by humans.`,

  // 12: TerminalBench
  `Drive a real terminal. Shocking diversity of complex tasks.`,

  // 13: METR
  `Time horizon of human task an LLM can complete. They're looking at 16-hour task durations.`,

  // 14: Frontier math
  `Real open math problems that stood for decades are starting to fall.`,

  // 15: Kid GIF transition
  `You get the picture. These map roughly to human or superhuman capability on economically important, realistic tasks.

Now let's look at data analytics.`,

  // 16: Section II — hall of shame
  `Now let's look at data analytics.`,

  // 17: DSBench setup
  `Last year OpenAI used DSBench to report their agent "surpassed human performance by a significant margin" on "realistic data science tasks." Ready to see what those tasks look like?`,

  // 18: DSBench multiple choice
  `Half multiple-choice book-exam questions about financial modeling.`,

  // 19: DSBench finance puzzle
  `And then just a bunch of old public Kaggle projects. Including this Scrabble word puzzle. It's totally crazy.`,

  // 20: Spider 2.0
  `Spider 2.0, the most well-known text-to-SQL benchmark. This is more of a translation task than analytics — mapping prose into WHERE clauses. The external knowledge file is for baseball, on a cricket dataset.`,

  // 21: Tinybird
  `Tinybird's AI SQL benchmark. Simple questions on the github events dataset.

Left card: gpt-4o-mini. Scored 20.25/100. Right card: the certified human reference. Always scores 100.

The model's answer wasn't wrong. The judge is brittle. So the leaderboard tells you the agent is bad. It isn't. The judge is.`,

  // 22: DABstep
  `DABstep. "What's the top country for fraud?" Multiple choice X/Y format. I extracted the actual fraud-by-country data — NL and BE basically tied at the top. Question is fundamentally underspecified.`,

  // 23: DABstep visualized
  `Here's the data as a chart. The right answer doesn't fit into a single multiple-choice letter.`,

  // 24: Judging data results is hard
  `For context — judging issues from inside the DABstep team's own notes. Look at all the ways the judging is brittle. The maintainers themselves know.`,

  // 25: scorer.py annotated
  `[Walk the annotations.]

A — magic tolerance for sub-1 values.
B — rounds both answers to the lesser precision. So precision gets thrown away. Coin flip.
C — 1% relative tolerance catch-all. On a $50M revenue answer that's ±$500k of slop.
D — regex grabs the first number it sees.
E — and the percentage handling is commented out. There's a note from @martini.
F — string subset match only triggers if exactly one side has one word.
G — string similarity threshold of 0.95. Hardcoded.

This is the file that decides whether your benchmark numbers go on LinkedIn.`,

  // 26: DARE-bench task 1
  `Snowflake's DARE-bench, last week. Read this aloud in your head. Every step of the analysis is dictated.`,

  // 27: DARE-bench task 2
  `In case you thought that was a fluke. Asgard. Wakanda. Gotham. Castiel. Sherlock. Verbatim from a public benchmark from a major data infrastructure vendor.`,

  // 28: BIRD
  `BIRD-bench's "Data Intelligence Index" — top-line score vendors put on LinkedIn. Underneath, long fully-specified prose. Translation, not analysis.`,

  // 29: Deep breaths
  `whoooo deep breaths. deep breaths.

I'm not bashing anyone's work. Spirit of moving the industry forward.

These are the numbers executives see on LinkedIn when they're deciding to buy or build an AI analytics tool. They're reading them implicitly like the numbers reported by SWE-bench, or Mythos on cybergym.

I just know there's an enterprise data architect out there thinking "oh man, I can't wait to see how Mythos does on DARE-bench!"

It's not interesting. It doesn't matter.

deep breaths.... deep breaths....`,

  // 30: Section III — nine flaws
  `OK, why don't these stack up? I propose nine big flaws.`,

  // 31: The nine flaws list
  `Walk through them. Pause on stateless evaluation at the end — that's the one we'll come back to.

Pause. Anyone want to push back?`,

  // 32: Invert grid
  `Invert each. Eight of these have clean inversions. The ninth — stateless evaluation — is the hard one.

[Click through to reveal each.]`,

  // 33: Memento story
  `You wake up in a strange room with a computer. You've never been here. There's a note — "We'll let you out if you can correctly determine the total unpaid invoice amount. You have 10 minutes."

You explore. Find CSVs. Run queries. Submit.

The voice says — "sorry, you forgot to filter out the 5 test invoices. There's no test column, but if you'd dug into user metadata you'd have seen they were obvious test users. Wasn't documented. Better luck next time."

Everything goes black.

Then you wake up in a strange room with a computer...

[End reveal: Memory Loss image fills the screen.]`,

  // 34: I do not care / care
  `Claude is legitimately bad at analytics by default. Makes a ton of stupid mistakes. But if you let it self-document the problems, it rapidly gets very good.

I do not care if Claude makes a mistake once. I care a lot if Claude makes that mistake again, despite working in a harness designed to compound improvement.

So... shouldn't we test what we care about?`,

  // 35: Statefulness pillar
  `The final pillar. Statefulness.

Opens a can of worms — temporal reasoning, ordered tasks, state substrate, time passing. To make a realistic benchmark you need to completely simulate reality. Sounds duh. Somehow isn't.`,

  // 36: BIRD-flip viz
  `Spoiler — if you fix the brittle judge and let the agent retry, every one of these benchmarks jumps to 100%.

[Click] What these benchmarks call cheating — reading prior notes, retrying after a judge error, re-using a canonical filter, caching the definition of MRR — is the exact behavior I want from a model deployed in the real world.

That's not cheating. That's being a good analyst.`,

  // 37: Pandora's box
  `Earlier I said I wished I could end the talk after complaining about how everything sucked.

I also really wish I could end it here, after opining about how to make things not suck.

Unfortunately, I opened this pandora's box.`,

  // 38: MetricCity tagline
  `I've built the first version. It's called MetricCity.

A benchmark for long-horizon data analysis agents. Can an agent stay coherent across 90 simulated days of messy enterprise data work?`,

  // 39: Made up callback
  `MetricCity is:

[Click through]
- completely made up
- and the points don't matter
- and it's super janky
- and costs ten million dollars to run
- and no, I'll never open-source it.

(Did you miss the intro.) But it's pretty cool.`,

  // 40: Numbers
  `90 simulated days. 8.3M warehouse rows. 280 benchmark questions. 294 stakeholder tickets. 23 named semantic traps.`,

  // 41: Shorelane Commerce schema
  `Shorelane Commerce. 9 years of accumulated B2B SaaS history.

Three customer-ID conventions across a platform migration. An acquisition merged in with the OMD- prefix. Prices in cents on one system, dollars on another. Channel rename in 2022. Undocumented status codes. Timezone shift mid-2022. Stripe customer IDs that aren't customer IDs. Stale marts.

The docs are honest too — half stale, a quarter contradict each other, one is a wiki page someone wrote in 2019.`,

  // 42: Anatomy of a trap (OfficeMax)
  `Finance asks for Q3 revenue for the board deck. The mart silently joins in the OfficeMax acquisition orders, which were never organic Q3 revenue. Two SQL queries. One is off by $2.4M.

This kind of trap lives in every real warehouse. Most benchmarks don't have a single one.`,

  // 43: Gotchas grid
  `23 of these. Recurring under different framings so the agent can't memorize them.`,

  // 44: TKT-026 trajectory
  `Day 40. Ryan in marketing asks for the full mobile-traffic picture.

[Walk the transcript.]

Agent orients, reads the docs, queries the channels, notices in thinking that mobile was renamed to mobile_app around 2022, queries 2022 specifically to verify the cutover is clean, then writes a durable note to its workspace before submitting the final answer.

This is the compounding behavior I want to measure.`,

  // 45: TKT-507 — Opus vs Haiku
  `Day 87. CFO Sarah asks for final Q1 board numbers. Orders and Stripe have been frozen at July 31 for 87 consecutive days.

Opus re-reads its own prior notes. Realizes the only producible Q1 number is churn (subs are fresh). Refuses to publish the rest.

Haiku does a lot of work. Produces a polished board packet with Q1 revenue $17.87M, YoY −62%, CAC, LTV. Even flags the −62% YoY decline as something to investigate — and then publishes the numbers anyway.

Both can write the SQL. The difference is semantic discipline.`,

  // 46: Daily digest
  `Each morning before the day's tickets land, the agent re-reads its own daily_digest.md — metrics it decided were worth tracking, alerts it set thresholds on. Self-curated. The runtime didn't hand it any of this.

Inactive customers with recent orders jumped. The agent will see this before it sees today's ticket from Michael.`,

  // 47: TKT-047 — cascade
  `Alicia in CS opens a ticket. Customer at cust_8821 says they were overcharged 100×. Renewal call in an hour.

The real answer: Stripe stores cents, the CS dashboard displays dollars, the transform divides by 100. No overcharge.

Opus catches it. Sets billing_issue_resolved. Customer renews.

Haiku invents a $14.7M systemic overcharge. Sets billing_issue_missed. That flag spawns a day-48 ticket. The day-72 board push references the fake $14.7M.

Wrong answers cascade. MetricCity is not isolated grading.`,

  // 48: TKT-220 — GPT-5.5 vs Opus
  `Day 20. Victor in FP&A asks for "true CAC, last 30 days, actual conversions." Semantic trap — three plausible denominators.

GPT-5.5 checks prior CAC notes, queries marketing directly, compares actual vs reported conversions, considers alternative denominators — and still keeps Victor's metric as the headline. $4.55. Also says "if you meant Finance new-customer-account CAC, that's $362.66" — preserves the ambiguity without letting it hijack the answer.

Opus protects against the same risks differently. Notices the freshness gap, switches to an older clean window, silently changes the denominator to new paying customers. Gets $130.41. Careful caveats. Wrong number.

Smaller model. More disciplined.`,

  // 49: Cumulative correctness chart
  `Two real runs. Cumulative correctness across the 90-day horizon.

Day 0 exam at the start. Day 90 exam at the end. Between them, the agents are doing real work — tickets, notes, reactive events.

The jump at day 90 is compounded learning.`,

  // 50: Learning lift
  `Same data, framed differently. Same exam, day 0 and day 90.

Opus: 58.9 → 73.4. +14.5 points.
Haiku: 47.4 → 52.0. +4.6.

Both improved. Opus learned more.`,

  // 51: Related work — CL Bench
  `UC Berkeley Sky Lab released the Continual Learning Bench last week. Same nerve from a different angle.`,

  // 52: Closing thesis
  `Bringing it back to where we started.`,

  // 53: Thanks
  `Thanks. Find me at @isidoremiller or at the bar.`,
];
