# CITE & CORE-EEAT Dimensions — Beginner's Dictionary

> Plain-language definitions for every sub-item in the two frameworks this library scores against. Written for someone who has never done SEO or GEO before.

---

## 0. First, what are these two frameworks?

**SEO** = Search Engine Optimization = making your page show up higher on Google.
**GEO** = Generative Engine Optimization = making your page get **cited** by AI chatbots (ChatGPT, Claude, Gemini, Perplexity, Google AI Overviews) when someone asks them a question.

They're related but not the same. Google ranks pages; AI engines quote pages. You can rank #1 on Google and still never be quoted by ChatGPT, or vice-versa.

Two checklists are used to grade how well you're doing:

| Framework | Scope | What it grades | Items | Vetoes (auto-fail) |
|---|---|---|---|---|
| **CORE-EEAT** | A single page/article | Is this piece of content worth citing? | 80 (8 dimensions × 10) | C01, R10, T04 |
| **CITE** | A whole website/domain | Is this website worth trusting as a source? | 40 (4 dimensions × 10) | T03, T05, T09 |

**Veto** = if you fail this item, your whole score is capped at "Poor" no matter how well you did on everything else. These are the deal-breakers.

**Scoring**: every item is Pass (10) / Partial (5) / Fail (0). Sum the 10 items in a dimension → 0-100 for that dimension. Then average the dimensions.

> **Heads-up on naming**: Both frameworks use letters like C, T, E for dimensions. When you see `C01` you have to know which framework. In this doc, CORE-EEAT items always have the dimension name spelled out (e.g., "C — Contextual Clarity C01"), and CITE items are prefixed with "CITE" to avoid confusion.

---

# CORE-EEAT — How to grade a single page (80 items)

CORE-EEAT splits into two halves:
- **CORE** (40 items) = grades the content **body** — what's written on the page.
- **EEAT** (40 items) = grades the **source** — who wrote it, what organization publishes it, what the site looks like overall.

## C — Contextual Clarity *(does the page clearly answer the user's question?)*

> Imagine someone searching "best running shoes for flat feet." If your page is titled that but then spends 400 words on the history of shoes before getting to the point, you fail Contextual Clarity. The reader (and the AI) gave up.

### C01 — Intent Alignment *(VETO — instant fail if broken)*
**Plain English**: Does the page actually deliver what the title promised?
**Why**: This is the #1 clickbait detector. If your title says "10 easy pasta recipes" but the page is actually a sales pitch for a cookbook, AI engines will stop trusting your domain permanently. Google's Helpful Content update also penalizes this.
**Example**:
- ✅ Title: "How to tie a bowline knot" → Page shows steps to tie a bowline knot.
- ❌ Title: "Free Bitcoin calculator" → Page is a blog post about crypto history with no calculator.

### C02 — Direct Answer
**Plain English**: Is the main answer to the question given in the first 150 words?
**Why**: AI engines like ChatGPT and Google AI Overviews literally scan the opening paragraphs for a quotable answer. If your answer is buried in paragraph 12, the AI grabs it from a competitor who put it up front.
**Example**: Someone searches "what is a mortgage?" The best page opens with: *"A mortgage is a loan used to buy a house, where the house itself is the collateral — if you don't pay, the lender takes the house."* That one sentence could be cited by ChatGPT directly.

### C03 — Query Coverage
**Plain English**: Does the page cover at least 3 different ways people might phrase the same question?
**Why**: People search in different words for the same thing ("how to fix a leaky faucet" vs. "dripping tap repair" vs. "faucet won't stop leaking"). Covering the variants lets you rank for all of them.
**Example**: An article about "cold brew coffee" should also mention "cold-brewed coffee," "cold press coffee," and "slow-extraction coffee" naturally in the text.

### C04 — Definition First
**Plain English**: Are unfamiliar terms defined the first time they appear?
**Why**: If you use the word "escrow" without defining it, a reader who doesn't know that word bounces — and AI engines that like "self-contained" content (Perplexity especially) skip you for a competitor who defined it.
**Example**: *"Your money goes into escrow (a neutral third-party account that holds funds until both parties meet the terms of the deal)."*

### C05 — Topic Scope
**Plain English**: Does the page clearly say what it does and doesn't cover?
**Why**: A reader who knows the boundary trusts the article more. An AI engine that sees an explicit scope is more likely to cite the page for queries within that scope and leave it alone for queries outside it.
**Example**: *"This guide covers home espresso machines under $500. It does not cover commercial machines or manual lever espresso makers."*

### C06 — Audience Targeting
**Plain English**: Does the page say who it's for?
**Why**: "This guide is for beginner gardeners" tells a reader whether to keep reading, and tells the AI engine which queries to surface the page for.
**Example**: *"This article is for small business owners who have never filed a tax return themselves."*

### C07 — Semantic Coherence
**Plain English**: Do the paragraphs flow logically, or does the topic jump around randomly?
**Why**: AI engines look for a natural flow when deciding what to quote. A page that jumps from "dog food ingredients" to "dog show history" to "dog food ingredients" loses both humans and AI.
**Example of broken coherence**: Paragraph 1 is about choosing a crib, paragraph 2 is about baby sleep schedules, paragraph 3 is back to crib materials. The AI engine can't extract a coherent summary from that.

### C08 — Use Case Mapping
**Plain English**: Does the page tell you *when* to choose A over B?
**Why**: Decision frameworks are extremely valuable to AI engines because they produce directly quotable "if you need X, choose Y" snippets.
**Example**: *"Choose a standing desk if you spend more than 6 hours at your desk and have lower-back pain. Stick with a regular desk if you mostly move around during the day."*

### C09 — FAQ Coverage
**Plain English**: Does the page have a real FAQ section at the bottom?
**Why**: This is GEO priority #2. When ChatGPT or Google AI Overview answers a follow-up question, they very often pull the answer directly from somebody's FAQ section. Having one makes you 10× more likely to get cited.
**Example**: After your main article about "how to apply for a passport," include Q&A pairs like *"How long does a passport application take?"*, *"Can I renew online?"*, *"What happens if my photo is rejected?"*

### C10 — Semantic Closure
**Plain English**: Does the conclusion actually loop back and answer the opening question, then tell the reader what to do next?
**Why**: A good close signals to both human and AI that the article is complete. "Now that you know X, try Y" is a citable ending. A page that just stops mid-thought doesn't get cited.

---

## O — Organization *(is the page structured so both humans and machines can scan it?)*

> Think of this as "how clean is the layout." AI engines don't actually read pages the way humans do — they extract chunks from headings, tables, and lists. Bad structure = no chunks to extract = no citation.

### O01 — Heading Hierarchy
**Plain English**: Is there one H1, then H2s under it, then H3s under those — without skipping levels?
**Why**: An H1→H3→H2→H4 hierarchy confuses screen readers, Google, and AI engines. They use the heading tree to understand which section is about what.
**Example**: ✅ H1 "Italian Pasta" → H2 "Fresh pasta" → H3 "Tagliatelle" → H3 "Pappardelle". ❌ H1 "Italian Pasta" → H3 "Tagliatelle" (skipped H2).

### O02 — Summary Box (TL;DR)
**Plain English**: Does the top of the page have a short "Key Takeaways" box?
**Why**: GEO priority #6 — AI engines grab summary boxes as their first choice when they need a short answer. No summary box = no quick extract.
**Example**:
> **TL;DR**: Flat-bottom woks heat more evenly on electric stoves; round-bottom woks are better on gas. Buy carbon steel, not stainless. Season before first use.

### O03 — Data Tables
**Plain English**: Are comparisons and specs in a table instead of long paragraphs?
**Why**: GEO priority #3. Tables are the most extractable format for AI engines. A table comparing three products gets cited almost every time; the same info in prose almost never does.
**Example**: A comparison of three VPN services shown as a table with columns "Price / Speed / Privacy / Streaming" is 10× more likely to be cited than the same comparison written as three paragraphs.

### O04 — List Formatting
**Plain English**: When items are parallel (like 5 steps or 5 features), are they in a bullet/numbered list?
**Why**: Lists are the second-most extractable format after tables. AI engines pull numbered steps directly into their answers.

### O05 — Schema Markup
**Plain English**: Does the page have invisible JSON-LD code that tells search engines "this is a recipe" or "this is a product" or "this is a FAQ"?
**Why**: GEO priority #4. Schema is like a name tag for each type of content. Without it, Google has to guess what your page is. With it, you unlock rich results like star ratings, prep time, price boxes, FAQ dropdowns — all of which AI engines love.
**Example**: A recipe page with `Recipe` schema will show cook time and ratings directly in Google results.

### O06 — Section Chunking
**Plain English**: Does each section cover one topic? Are paragraphs 3-5 sentences instead of giant walls of text?
**Why**: Short chunks = easy for AI to extract a single idea. Long walls of text = AI can't tell where one idea ends and the next begins.

### O07 — Visual Hierarchy
**Plain English**: Are the important sentences **bolded** or highlighted so a reader skimming can find them?
**Why**: Skim-readability. Humans scan before they read. AI doesn't care about bold, but the discipline of bolding the key sentence usually forces you to have one.

### O08 — Anchor Navigation
**Plain English**: For long pages, is there a table of contents with clickable jump links?
**Why**: Google uses "jump-to-section" links in its results. Without anchor links, you lose that feature. Also helps humans on mobile.

### O09 — Information Density
**Plain English**: Is the article tight and meaningful, or is it padded with filler to hit a word count?
**Why**: AI engines prefer content that says a lot in a few words. "In today's fast-paced world..." is filler; it gets downgraded. Say useful things per sentence.

### O10 — Multimedia Structure
**Plain English**: Do images and videos have captions that actually add information?
**Why**: A chart labeled "Figure 1: Sales growth 2020-2024" is citable. An image with no caption is decoration. AI engines can't read the inside of images very well, so the caption is where the information lives.

---

## R — Referenceability *(can AI and humans verify your claims?)*

> This is where most content fails. The web is full of unsupported opinions. Pages that cite sources, include precise numbers, and link to primary research get dramatically more AI citations because the AI can "check the math."

### R01 — Data Precision
**Plain English**: Does the article include at least 5 specific numbers with units (like "73%" or "$1,200" or "3.2 seconds")?
**Why**: "Many users" is vague. "73% of users" is citable. AI engines prefer precise numbers because they can quote them cleanly.
**Example**: ❌ "A lot of people skip breakfast." ✅ "47% of Americans under 30 skip breakfast, according to a 2024 USDA survey."

### R02 — Citation Density
**Plain English**: Does the article cite at least 1 external source per 500 words?
**Why**: A 2000-word article should link to at least 4 external sources. If it doesn't, AI engines assume you're making things up. Perplexity especially filters out uncited content.

### R03 — Source Hierarchy
**Plain English**: Are your citations from **primary** sources (research papers, government data, official company pages) rather than secondary blogs?
**Why**: Primary sources rank higher. ChatGPT prefers pages that cite the original, not pages that cite other blogs.
**Example**: ✅ Link to a CDC report about flu cases. ❌ Link to a random blog that mentions a CDC report.

### R04 — Evidence-Claim Mapping
**Plain English**: Every claim you make is immediately followed by the evidence.
**Why**: This is Claude's #1 preferred pattern. "Sleep deprivation causes weight gain [citation next to the claim]" is citable. "Sleep deprivation causes weight gain. Also, it causes anxiety. And by the way, here's a paper." is not — the evidence is floating, unattached.

### R05 — Methodology Transparency
**Plain English**: If you did a study, test, or review, do you explain exactly how you did it?
**Why**: Perplexity loves methodology transparency. "We tested 12 vacuums on hardwood for 3 weeks" is more citable than "we tested some vacuums."

### R06 — Timestamp & Versioning
**Plain English**: Is the "last updated" date visible, and is it less than a year old?
**Why**: Old content is less likely to be cited. If Google sees your page was last updated in 2019, it treats it as stale for most topics.

### R07 — Entity Precision
**Plain English**: Do you use **full names** for people, companies, and products?
**Why**: "The CEO said..." is vague. "Sundar Pichai, CEO of Google, said..." is precise. AI engines can't pick up pronoun-heavy text as citations because the pronoun loses meaning once extracted.

### R08 — Internal Link Graph
**Plain English**: Do you link to other pages on your own site using descriptive anchor text?
**Why**: "Click here" tells nothing. "How we test fitness trackers" tells both a reader and Google what the linked page is about. Good internal linking is how search engines understand which page is the authority on what topic.

### R09 — HTML Semantics
**Plain English**: Does the page use proper HTML tags like `<article>`, `<time>`, `<cite>`, `<figure>` instead of just `<div>` everywhere?
**Why**: Semantic tags tell machines "this is an article" or "this is a caption." A page built entirely of `<div>`s is harder for AI to parse.

### R10 — Content Consistency *(VETO)*
**Plain English**: Does your data contradict itself? Are there broken links (404s)?
**Why**: If paragraph 1 says "47% of users" and paragraph 8 says "62% of users" for the same thing, you lose all credibility. A single broken link reduces trust. Data that contradicts itself = instant fail.

---

## E — Exclusivity *(do you have something others don't?)*

> The web is 99% rehashed content. Exclusivity is what makes your page different — original data, a new framework, a contrarian take, a custom tool. This is what earns organic backlinks.

### E01 — Original Data
**Plain English**: Did you collect your own data (survey, experiment, test)?
**Why**: AI engines *love* citing pages with exclusive data because they can't get the data anywhere else. This is GEO priority #5.
**Example**: A SaaS company publishes "We analyzed 10,000 customer support tickets and found X." That's citation gold.

### E02 — Novel Framework
**Plain English**: Did you create a named, structured way of thinking about the topic that others can cite?
**Why**: "The 5-F Framework for Customer Retention" is citable by name. Generic best-practices lists are not.

### E03 — Primary Research
**Plain English**: Did you conduct the original experiment/survey yourself with a documented process?
**Why**: Similar to E01, but with the process shown. Documented primary research is the highest-tier citation material.

### E04 — Contrarian View
**Plain English**: Do you challenge the mainstream consensus with evidence?
**Why**: "Most guides say X. Our data shows Y." Contrarian takes with evidence earn backlinks because other people quote them as "interesting exceptions."

### E05 — Proprietary Visuals
**Plain English**: At least 2 original infographics, charts, or diagrams made by you.
**Why**: A custom chart is a content asset. It earns image backlinks and is harder to copy. Stock photos don't count.

### E06 — Gap Filling
**Plain English**: Does the page answer questions that competing pages skip?
**Why**: If every other article about "backpacking stoves" skips fuel safety, and yours covers it in depth, you own that query. Content gaps are opportunities.

### E07 — Practical Tools
**Plain English**: Does the page include a downloadable template, checklist, calculator, or spreadsheet?
**Why**: Tools earn backlinks and repeat visits. A "mortgage calculator" page can rank for 100 keywords because people link to the calculator, not just the article.

### E08 — Depth Advantage
**Plain English**: Is your content deeper than the top-ranking pages on the same topic?
**Why**: If all top-10 pages are 1,200 words and yours is 3,500 words of dense, useful content, you'll overtake them. Depth = advantage.

### E09 — Synthesis Value
**Plain English**: Do you combine knowledge from two different fields in a way nobody else has?
**Why**: Cross-domain articles are rare and highly citable. "What poker theory teaches startup founders" combines two fields and is instantly more interesting than either topic alone.

### E10 — Forward Insights
**Plain English**: Do you make data-backed predictions or identify trends?
**Why**: Predictions are quotable. "By 2027, X will happen because of Y" is citable in a way that historical recaps aren't.

---

## Exp — Experience *(has the author actually used/done the thing?)*

> This is Google's "E" in E-E-A-T (the first E was added in 2022). Google wants to see that the writer has personal, hands-on experience with the topic, not just book knowledge.

### Exp01 — First-Person Narrative
**Plain English**: Does the article say "I tested," "we found," "I used this for 3 months"?
**Why**: First-person language is a strong signal of actual experience. Google trusts "I spent 6 weeks with this phone" more than "This phone has a 6-inch screen."

### Exp02 — Sensory Details
**Plain English**: Are there at least 10 sensory words — how it felt, looked, sounded, smelled, weighed?
**Why**: You can't fake sensory details from a spec sheet. "The grip felt slippery when my hands got sweaty" is experience; "features a textured grip" is marketing.

### Exp03 — Process Documentation
**Plain English**: Step-by-step account with a timeline ("Day 1... Day 7... Day 30").
**Why**: Timelines prove you actually did it. Random reviewers can't fake a 30-day diary.

### Exp04 — Tangible Proof
**Plain English**: Original photos or screenshots with visible timestamps.
**Why**: Stock photos are obvious. Your own photo — especially with a date visible in the corner — is proof of use.

### Exp05 — Usage Duration
**Plain English**: Does it say "after 3 months of daily use" instead of just reviewing the first impression?
**Why**: First-week reviews miss long-term issues. Google's E-E-A-T update specifically rewards pages that show prolonged use.

### Exp06 — Problems Encountered
**Plain English**: Does the page share real problems you hit plus how you solved them?
**Why**: Honest problem-reporting is the opposite of a marketing fluff piece. Readers (and algorithms) trust it more.

### Exp07 — Before/After Comparison
**Plain English**: Shows what changed — weight, speed, cost, appearance.
**Why**: Before/after is directly quantifiable. "Lost 12 pounds in 6 weeks" is stronger than "I lost weight."

### Exp08 — Quantified Metrics
**Plain English**: Experience expressed in numbers (time saved, money spent, success rate).
**Why**: Numbers let other people compare. "Cut my grading time from 4 hours to 45 minutes" is cited; "saved time" is not.

### Exp09 — Repeated Testing
**Plain English**: Tested multiple times or tracked over a long period.
**Why**: One test is an anecdote; five tests are a pattern. Patterns are more reliable, so AI engines prefer them.

### Exp10 — Limitations Acknowledged
**Plain English**: Does the author say "we only tested this scenario, so results may differ for X"?
**Why**: Acknowledging limitations is a Claude-preferred pattern. It signals honesty and makes the rest of the content more trustworthy.

---

## Ept — Expertise *(does the author know what they're talking about professionally?)*

> Experience (Exp) = you did it. Expertise (Ept) = you're trained in it. A home cook writing about baking sourdough can have high Experience but low Expertise. A PhD food scientist writing about sourdough has the opposite. Ideally you want both.

### Ept01 — Author Identity
**Plain English**: Is there a byline with author's name, avatar, and bio longer than 30 words?
**Why**: Anonymous articles are treated as low-trust. Google specifically looks for an author page.

### Ept02 — Credentials Display
**Plain English**: Are relevant degrees, certifications, or years of experience shown?
**Why**: For YMYL topics (Your Money or Your Life — health, finance, legal), Google demands visible credentials. No credentials = no ranking for medical queries.

### Ept03 — Professional Vocabulary
**Plain English**: Correct use of industry jargon.
**Why**: Misusing a term (e.g., confusing "API" with "SDK") marks you as an outsider. AI engines pick up on vocabulary errors.

### Ept04 — Technical Depth
**Plain English**: Specific parameters, thresholds, and examples instead of vague generalities.
**Why**: "Use 15-20 psi pressure" is expert; "use enough pressure" is not.

### Ept05 — Methodology Rigor
**Plain English**: The author's analysis method is reproducible — you could follow the same steps and get the same result.
**Why**: This is a Perplexity-preferred pattern. Reproducible method = scientific rigor.

### Ept06 — Edge Case Awareness
**Plain English**: Discusses at least 2 exceptions or "when this doesn't apply" situations.
**Why**: Experts know where their advice breaks down. Novices give universal-sounding advice. Edge cases are the tell.

### Ept07 — Historical Context
**Plain English**: Shows knowledge of how the field evolved.
**Why**: "The original specification from 1994 said X, but it was updated in 2011 to Y" demonstrates long-term field knowledge.

### Ept08 — Reasoning Transparency
**Plain English**: Explains why you chose A over B, including trade-offs.
**Why**: Claude's top-preferred pattern. "We chose SQL over NoSQL because we needed consistent transactions, at the cost of horizontal scalability" is citable.

### Ept09 — Cross-Domain Integration
**Plain English**: Connects knowledge across different fields.
**Why**: Shows the author understands the topic well enough to see parallels elsewhere. Rare and valuable.

### Ept10 — Editorial Process
**Plain English**: Shows "Reviewed by" or "Fact-checked by" labels.
**Why**: Editorial oversight is a strong trust signal, especially for health and finance content.

---

## A — Authority *(does the outside world recognize you?)*

> Authority is about **other people** vouching for you. You can't buy it; you have to earn it through backlinks, mentions, awards, partnerships.

### A01 — Backlink Profile
**Plain English**: Are you linked to by respected sites (.edu, .gov, industry leaders)?
**Why**: A single link from a university or a major publication is worth thousands of links from random blogs.

### A02 — Media Mentions
**Plain English**: "As featured in..." with logos of news outlets.
**Why**: Being quoted by major publications transfers their authority to you.

### A03 — Industry Awards
**Plain English**: Visible awards or industry recognition.
**Why**: Awards are third-party validation. They're hard to fake and easy to verify.

### A04 — Publishing Record
**Plain English**: Conference talks, published papers, patents.
**Why**: Shows the author/organization is active in their field beyond just their own website.

### A05 — Brand Recognition
**Plain English**: Does your brand name have measurable search volume? (People search for "[your name]" directly.)
**Why**: If people search for you by name, you're a known entity. If nobody searches for you, you're invisible.

### A06 — Social Proof
**Plain English**: Real testimonials with real user details — names, photos, results.
**Why**: "Great product!" from "John S." is worthless. "Emma, 34, VP of Marketing at Acme Corp, increased lead volume 40%" is credible.

### A07 — Knowledge Graph Presence
**Plain English**: Google shows a Knowledge Panel when someone searches your name. You have a Wikipedia page.
**Why**: Knowledge Graph = Google officially recognizes you as an entity. This is one of the strongest GEO signals.

### A08 — Entity Consistency
**Plain English**: Your brand name, description, and contact info are identical across every website that mentions you.
**Why**: Discrepancies confuse AI engines. If LinkedIn says you're a "marketing agency" but your site says "consultancy," the AI isn't sure what you are.

### A09 — Partnership Signals
**Plain English**: Shown partnerships with authoritative organizations.
**Why**: Logos of known partners act as third-party endorsements.

### A10 — Community Standing
**Plain English**: Active in professional communities — conferences, forums, standards bodies.
**Why**: Community presence is an authority signal that can't be bought.

---

## T — Trust *(does the site meet basic trust/safety standards?)*

> Trust is defensive — it's about not having red flags. A site can be expert and authoritative but still fail Trust if it has broken SSL, no contact info, or affiliate links without disclosure.

### T01 — Legal Compliance
**Plain English**: Does the site have a Privacy Policy and Terms of Service?
**Why**: Both are legally required in most jurisdictions, and Google flags sites that lack them.

### T02 — Contact Transparency
**Plain English**: Can you find a physical address or at least 2 ways to contact the company?
**Why**: Scam sites hide contact info. Real businesses publish it.

### T03 — Security Standards
**Plain English**: Site-wide HTTPS with no security warnings.
**Why**: A site that's not HTTPS in 2024 is treated as unsafe. Google displays a warning banner to visitors.

### T04 — Disclosure Statements *(VETO)*
**Plain English**: Affiliate links must be disclosed ("This post contains affiliate links.")
**Why**: FTC-required in the US. Google specifically penalizes undisclosed affiliate content. **Missing disclosures cap the entire article at "Poor" regardless of quality.**

### T05 — Editorial Policy
**Plain English**: Does the site publish its content standards and review process?
**Why**: Publications with visible editorial policies are trusted more. It shows accountability.

### T06 — Correction & Update Policy
**Plain English**: Is there a corrections page or changelog?
**Why**: Honest publications show their mistakes and updates. Opaque sites don't.

### T07 — Ad Experience
**Plain English**: Ads take less than 30% of the page, with no pop-ups that block content.
**Why**: Intrusive ads are a Google ranking factor. Aggressive ads destroy trust.

### T08 — Risk Disclaimers
**Plain English**: For YMYL topics (medical, financial, legal advice), are appropriate disclaimers present?
**Why**: "This is not medical advice. Consult a doctor." protects users and earns Google's trust.

### T09 — Review Authenticity
**Plain English**: If you show customer reviews, do they have authenticity signals (dates, verified purchases, variety)?
**Why**: Sites full of 5-star reviews all posted the same day are obviously fake. Real reviews vary.

### T10 — Customer Support
**Plain English**: Clear return policy, complaint channels, response SLA.
**Why**: For e-commerce especially. A site with no support info looks like a scam storefront.

---

# CITE — How to grade a whole domain (40 items)

CITE looks at your **entire website**, not a single page. A great article on a sketchy domain still won't rank or get cited because the domain itself isn't trusted.

CITE has 4 dimensions with different weights by default:

| Dimension | Default Weight | What it asks |
|---|---|---|
| **C** Citation (35%) | How much is this domain referenced — by links and by AI? |
| **I** Identity (20%) | Is this domain recognizable as a distinct entity? |
| **T** Trust (25%) | Are there red flags suggesting manipulation? |
| **E** Eminence (20%) | How visible and influential is the domain? |

## CITE-C — Citation *(how much do others link to and quote this domain?)*

### CITE-C01 — Referring Domains Volume
**Plain English**: How many **different websites** link to you? (Note: different websites, not total links — one site linking 1000 times still counts as 1.)
**Why**: This is the foundational backlink metric. A site with 500+ referring domains is in a different league than one with 20.
**Example**: If nytimes.com and cnn.com both link to you, you have 2 referring domains — even if the NYT links to you from 50 different articles.

### CITE-C02 — Referring Domains Quality
**Plain English**: Of the sites linking to you, what percentage have high Domain Authority (DR/DA 50+)?
**Why**: 200 links from universities and major publications > 10,000 links from blog comments. Quality beats quantity.
**Good score**: 20%+ of your backlinks are from high-authority sites.

### CITE-C03 — Link Equity Distribution
**Plain English**: Do the sites linking to you concentrate their outbound links on a few quality sources, or do they link to everything?
**Why**: A site that links to 100 outbound sites passes more "link juice" to each than one that links to 100,000 sites. A link from a selective linker is worth more than a link from a directory that links to everyone.

### CITE-C04 — Link Velocity
**Plain English**: Are you acquiring backlinks at a steady, natural pace, or do you have suspicious spikes?
**Why**: Organic link growth looks like a smooth curve. Buying links shows up as sudden spikes. A month with 3× your normal link acquisition triggers a manipulation flag at Google.

### CITE-C05 — AI Citation Frequency
**Plain English**: How often do AI engines (ChatGPT, Claude, Perplexity, Gemini, Google AI Overview) actually cite your domain when answering questions?
**Why**: This is the newest and most GEO-critical metric. Traditional SEO tools don't measure it yet, so most sites don't know their own score. But it's the most direct measurement of AI visibility.
**Good score**: Cited on 10+ niche queries across 2+ AI engines.

### CITE-C06 — AI Citation Prominence
**Plain English**: When you *are* cited, are you the main source or just a footnote buried below 5 other sources?
**Why**: Being the primary citation (the one the AI quotes from) is worth 10× being a secondary mention.

### CITE-C07 — Cross-Engine Citation
**Plain English**: Are you cited by at least 3 different AI engines, or just one?
**Why**: Cited by ChatGPT only = you're optimized for ChatGPT's specific preferences. Cited by ChatGPT + Claude + Perplexity = you're a genuinely authoritative source.

### CITE-C08 — Citation Sentiment
**Plain English**: When AI engines mention your domain, do they do it in a positive, neutral, or negative context?
**Why**: "Example.com is a trusted source of X" is good. "Example.com was exposed for Y" is bad and drags down future citations.

### CITE-C09 — Editorial Link Ratio
**Plain English**: What percentage of your backlinks are editorial (inside articles, guides, research) vs. non-editorial (directories, forum signatures, blog comments)?
**Why**: Editorial links are earned; directory links are placed. Google weights editorial links much higher.
**Good score**: 60%+ editorial.

### CITE-C10 — Link Source Diversity
**Plain English**: Do your backlinks come from at least 3 different industries and 5 different countries?
**Why**: 500 links all from one industry in one country looks like a niche bubble. Diverse link sources look like broad authority.

---

## CITE-I — Identity *(is this domain clearly recognized as a specific entity?)*

### CITE-I01 — Knowledge Graph Presence
**Plain English**: Is your entity registered in Google Knowledge Graph, Wikidata, and ideally Wikipedia?
**Why**: AI engines use knowledge graphs to verify identities. If your brand isn't in any knowledge graph, the AI literally doesn't know you exist as a distinct entity.
**Good score**: Listed in 2+ knowledge graphs.

### CITE-I02 — Brand Search Volume
**Plain English**: How many people search Google for your brand name each month?
**Why**: Search volume for your brand name is the cleanest measure of brand recognition. 0 monthly searches = nobody's looking for you. 1,000+ = you're a known brand.

### CITE-I03 — Brand SERP Ownership
**Plain English**: When someone searches your brand name, how much of the first page of Google is *you*? (Your website, your YouTube channel, your LinkedIn, your Wikipedia...)
**Why**: If a competitor or critic owns more of your brand SERP than you do, you have a reputation problem.
**Good score**: 7+ first-page results are yours.

### CITE-I04 — Schema.org Coverage
**Plain English**: What percentage of your site's pages have proper schema markup?
**Why**: Schema tells AI engines what each page is about. 50%+ coverage = AI-friendly. <20% = AI has to guess.

### CITE-I05 — Author Entity Recognition
**Plain English**: Do the authors of your content have verifiable public identities (real name, LinkedIn, published work, etc.)?
**Why**: Anonymous content is low-trust. Content by named, verifiable experts is high-trust. Especially critical for YMYL topics.

### CITE-I06 — Domain Tenure
**Plain English**: How old is the domain, and has it been in continuous use that whole time?
**Why**: Old domains are more trusted — but only if they've been actively used. A 10-year-old domain that was abandoned for 7 years and recently resurrected is actually *less* trusted than a fresh one, because it might be a bought expired domain used for manipulation.
**Good score**: 5+ years of continuous use.

### CITE-I07 — Cross-Platform Consistency
**Plain English**: Is your brand name, logo, description, and contact info identical on your website, LinkedIn, Twitter, GitHub, Crunchbase, etc.?
**Why**: Inconsistencies confuse AI engines. If your site says "Acme Inc." but LinkedIn says "Acme Technologies Inc.," the AI isn't sure these are the same entity.

### CITE-I08 — Niche Consistency
**Plain English**: Have you been in the same niche for 3+ years without a major pivot?
**Why**: A site that used to be about gardening and suddenly switches to cryptocurrency loses topical authority. Sticking to one niche compounds over time.

### CITE-I09 — Unlinked Brand Mentions
**Plain English**: How many times is your brand mentioned on other websites *without* a link back?
**Why**: Mentions without links still count toward brand authority. Google measures them. If people are talking about you but not linking to you, you're still getting a signal — just not as strong as a link.

### CITE-I10 — Query-Brand Association
**Plain English**: When someone starts typing an industry query into Google, does your brand name appear in the autocomplete?
**Why**: Autocomplete inclusion means Google has linked your brand to that query category. It's a strong signal that you're a known player in the space.
**Example**: Typing "crm software for" and seeing "crm software for [yourbrand]" suggested means you've made it.

---

## CITE-T — Trust *(are there manipulation red flags?)*

> This dimension is defensive: it looks for signs of cheating. It has 3 veto items — any one can instantly cap your CITE score at "Poor."

### CITE-T01 — Link Profile Naturalness
**Plain English**: Does your backlink growth look natural, or does it have suspicious bursts?
**Why**: No month should make up more than 15% of your total backlinks. If you went from 500 backlinks to 2,000 in one month, that's a 75% burst — an obvious manipulation signal.

### CITE-T02 — Dofollow Ratio Normality
**Plain English**: "Dofollow" vs "nofollow" links.

**What is a dofollow link?** When Website A links to Website B, the link includes hidden instructions for search engines. A `dofollow` link tells Google "follow this link and pass authority to the target." A `nofollow` link says "I'm linking, but don't count this as an endorsement." Think of dofollow as "I vouch for this site" and nofollow as "I'm just mentioning this site."

**So what's a good ratio?** A natural backlink profile has **40-85% dofollow** and the rest nofollow. Why? Because real websites link naturally — some sites mark all their links nofollow (Wikipedia, forums, comment sections), while others don't. If your dofollow ratio is **over 90%**, it means somebody built all your backlinks deliberately to pass authority — a manipulation signal. If it's **under 20%**, you probably bought comment/forum links that nobody trusts.
**Good score**: 40-85% dofollow.

### CITE-T03 — Link-Traffic Coherence *(VETO)*
**Plain English**: Does your organic traffic match your link count?
**Why**: Sites with 10,000 backlinks but only 50 visitors a month are link farms — they have manipulated backlinks but no real audience. Google can spot this and penalizes hard. **This is a veto item: fail and your whole CITE score is capped at Poor.**

### CITE-T04 — IP/Network Diversity
**Plain English**: Are your backlinks coming from many different server IP ranges, or are they all on the same few servers?
**Why**: Private Blog Networks (PBNs) — fake networks used to buy backlinks — all run on the same hosting infrastructure. If your backlinks come from 100+ different C-class IP ranges, they're distributed. If they all come from 3-4 IP ranges, it's a PBN signature.

### CITE-T05 — Backlink Profile Uniqueness *(VETO)*
**Plain English**: Does any other domain share 60%+ of the same backlinks as you?
**Why**: Natural backlink profiles are unique — no two real websites have the same links. If two sites have nearly identical link profiles, it means they're part of a coordinated manipulation network. **Veto item.**

### CITE-T06 — WHOIS & Registration Transparency
**Plain English**: Is your domain ownership public, registered with a reputable registrar, and stable for 2+ years?
**Why**: Sketchy sites hide their registration or frequently change owners. Stable public registration = legitimate business.

### CITE-T07 — Technical Security
**Plain English**: HTTPS site-wide, HSTS enabled, no security warnings.
**Why**: A site without basic security is unsafe to cite. Google displays warnings to visitors.

### CITE-T08 — Content Freshness Signal
**Plain English**: Is new or updated content being published within the last 90 days?
**Why**: An abandoned site decays in authority. Even a great old site loses ranking over time if it stops updating.

### CITE-T09 — Penalty & Deindex History *(VETO)*
**Plain English**: Has Google manually penalized or deindexed the domain?
**Why**: A manual action in Search Console is the nuclear option — it means a human at Google reviewed your site and decided it was violating guidelines. **Until you fix the issue and request reconsideration, the site is effectively dead. Veto item.**

### CITE-T10 — Review & Reputation Signals
**Plain English**: For consumer-facing domains: average rating of 3.5/5 or better across 2+ third-party review platforms (Trustpilot, G2, BBB).
**Why**: Low reviews signal that your actual service is bad, which undermines any content authority you've built.

---

## CITE-E — Eminence *(how visible and influential is the domain?)*

### CITE-E01 — Organic Search Visibility
**Plain English**: How many different keywords does your site rank for in Google's top 100?
**Why**: More keyword rankings = broader visibility. A site ranking for 10,000 keywords is in a different league than one ranking for 50.

### CITE-E02 — Organic Traffic Estimate
**Plain English**: Estimated monthly organic visitors from search.
**Why**: Links and rankings should translate into traffic. A site ranking for many keywords but getting no traffic has low-volume keywords or bad click-through rates.
**Good score**: 10,000+ monthly organic visits.

### CITE-E03 — SERP Feature Ownership
**Plain English**: How many "SERP features" does your content appear in? (Featured snippets, People Also Ask boxes, Knowledge Panels, image packs, video carousels, etc.)
**Why**: SERP features are premium real estate on Google. Owning 3+ types of features means you're winning the visible battle, not just the blue-link list.

### CITE-E04 — Technical Crawlability
**Plain English**: Can search engines and AI crawlers access your site easily? Does it load in under 3 seconds? Is there a permissive robots.txt?
**Why**: If your robots.txt blocks AI crawlers (like ClaudeBot, GPTBot), AI engines can't read your site and won't cite you — even if your content is perfect. Many sites accidentally block these.

### CITE-E05 — Multi-Platform Footprint
**Plain English**: Is your brand active on 3+ major platforms (LinkedIn, Twitter/X, YouTube, GitHub, etc.) with recent activity?
**Why**: Brand presence beyond your own website compounds authority and diversifies traffic sources.

### CITE-E06 — Authoritative Media Coverage
**Plain English**: Have you been featured in 3+ authoritative publications (major newspapers, industry magazines, research reports)?
**Why**: Editorial coverage from established publications is one of the hardest things to fake and transfers serious authority.

### CITE-E07 — Topical Authority Depth
**Plain English**: Do you rank for **long-tail keywords** (4+ words) deep inside your niche?
**Why**: Ranking for "CRM software" (broad) is easy to fake. Ranking for "how to integrate HubSpot CRM with Shopify tags" (long-tail, specific) requires genuine depth. AI engines cite deep specialists over broad generalists.

### CITE-E08 — Topical Authority Breadth
**Plain English**: What percentage of sub-topics in your niche do you cover?
**Why**: A cooking site that covers all of "baking, grilling, meal prep, nutrition, kitchen gear" has broader topical authority than one that only covers "chocolate chip cookies."
**Good score**: 70%+ of niche sub-topics covered.

### CITE-E09 — Geographic Reach
**Plain English**: Does your organic traffic come from 10+ countries, or mostly just one?
**Why**: Global reach = global authority. A site that only pulls traffic from one country is a local player; one that pulls from many is international.

### CITE-E10 — Industry Share of Voice
**Plain English**: Across the top 50 keywords in your industry, what percentage of the visibility belongs to you?
**Why**: This is competitive positioning. If you own 5% of industry-wide visibility, you're a serious player. If you own 0.1%, you're invisible compared to the leaders.

---

# How the two frameworks fit together

A simple way to think about it:

- **CORE-EEAT** answers: *"Is this specific page worth quoting?"*
- **CITE** answers: *"Is the website behind it worth trusting at all?"*

You need both. Great content on an untrusted domain won't get cited (because AI engines filter out untrusted sources before picking what to quote). A trusted domain with thin content won't get cited either (because AI engines need something *specific* to quote).

| Your CITE Score | Your CORE-EEAT Score | Diagnosis | First Priority |
|---|---|---|---|
| High | High | Ideal. | Maintain and expand. |
| High | Low | Authority wasted on bad content. | Fix content quality first (CORE-EEAT). |
| Low | High | Great content, invisible domain. | Build domain authority (CITE). |
| Low | Low | Fundamental issues. | Fix content first, then build authority. |

---

## The 6 vetoes you must never trigger

If you remember nothing else from this document, remember these 6 items. Failing any one of them caps your score at "Poor" regardless of everything else:

### CORE-EEAT vetoes (content-level)
1. **C01 — Intent Alignment**: Title must match what the page delivers. No clickbait.
2. **R10 — Content Consistency**: No self-contradicting data. No broken links. One reality.
3. **T04 — Disclosure Statements**: Disclose affiliate links and sponsorships. FTC requires it; Google enforces it.

### CITE vetoes (domain-level)
4. **CITE-T03 — Link-Traffic Coherence**: Your backlinks must be proportional to your real traffic. No link farms.
5. **CITE-T05 — Backlink Profile Uniqueness**: Your backlink profile must be genuinely yours, not duplicated on other domains.
6. **CITE-T09 — Penalty & Deindex History**: No active Google manual actions. Fix any penalty before anything else.

Everything else in this document is about getting from "Poor" to "Excellent." These 6 items are about avoiding instant failure.
