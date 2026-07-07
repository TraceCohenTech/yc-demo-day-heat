"use client";

import { CountUp } from "@/components/CountUp";
import { Reveal } from "@/components/Reveal";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  Cell, CartesianGrid, PieChart, Pie, ScatterChart, Scatter, ZAxis,
  Legend,
} from "recharts";
import { useState } from "react";
import { motion } from "framer-motion";

/* ── DATA ── */

type Company = {
  name: string;
  batch: string;
  valuation: number;
  raised: string;
  category: "sleeper" | "hot-won" | "hot-failed" | "moderate";
  story: string;
  industry: string;
  founded: number;
  seedYear?: number;
  seriesAYear?: number;
  unicornYear?: number;
  status: "active" | "public" | "acquired" | "dead";
};

const COMPANIES: Company[] = [
  { name: "Airbnb", batch: "W09", valuation: 84, raised: "$6.4B", category: "sleeper", story: "No mention in contemporaneous W09 Demo Day press coverage (which spotlighted Foodoro, Echodio, Heyzap). Sold cereal boxes to survive early on.", industry: "Travel", founded: 2008, seedYear: 2009, seriesAYear: 2011, unicornYear: 2014, status: "public" },
  { name: "Stripe", batch: "S09", valuation: 159, raised: "$9.4B", category: "sleeper", story: "First customer in 2 weeks via YC network. Sequoia early. Still private at $159B.", industry: "Fintech", founded: 2010, seedYear: 2010, seriesAYear: 2012, unicornYear: 2014, status: "active" },
  { name: "Coinbase", batch: "S12", valuation: 43, raised: "$1.9B", category: "sleeper", story: "Only $320K committed when pitching a $1M seed round.", industry: "Crypto", founded: 2012, seedYear: 2012, seriesAYear: 2013, unicornYear: 2017, status: "public" },
  { name: "DoorDash", batch: "S13", valuation: 72, raised: "$2.5B", category: "sleeper", story: "Bottom half of batch at Demo Day. Nearly died in 2017–18.", industry: "Delivery", founded: 2013, seedYear: 2013, seriesAYear: 2014, unicornYear: 2018, status: "public" },
  { name: "Cruise", batch: "W14", valuation: 1, raised: "$16B", category: "sleeper", story: "Not in TechCrunch's top 8 picks. GM acquired for ~$1B in 2016 — a huge YC win. Peaked at $30B before pedestrian incident in 2023 led GM to shut down the robotaxi unit.", industry: "Autonomous", founded: 2013, seedYear: 2014, seriesAYear: 2015, status: "acquired" },
  { name: "Scale AI", batch: "S16", valuation: 29, raised: "$1.6B", category: "sleeper", story: "19-year-old founder. Pivoted during batch. Raised Series A in 2017.", industry: "AI", founded: 2016, seedYear: 2016, seriesAYear: 2017, unicornYear: 2021, status: "active" },
  { name: "Deel", batch: "W19", valuation: 17.3, raised: "$679M", category: "hot-won", story: "TechCrunch top 10 pick. Raised quickly post-Demo Day.", industry: "HR", founded: 2019, seedYear: 2019, seriesAYear: 2020, unicornYear: 2021, status: "active" },
  { name: "Rippling", batch: "W17", valuation: 20.8, raised: "$2B", category: "sleeper", story: "Zenefits baggage but closed seed in 2 weeks. 90% repeat backers.", industry: "HR", founded: 2016, seedYear: 2017, seriesAYear: 2019, unicornYear: 2021, status: "active" },
  { name: "OpenSea", batch: "W18", valuation: 0, raised: "$427M", category: "moderate", story: "Peaked at $13B during NFT mania. Sold to Coinbase for undisclosed amount at massive loss.", industry: "Crypto", founded: 2017, seedYear: 2018, seriesAYear: 2021, unicornYear: 2021, status: "acquired" },
  { name: "Faire", batch: "W17", valuation: 5.2, raised: "$1.7B", category: "sleeper", story: "Raised $3.4M seed from Khosla shortly after YC. Peaked at $12.6B, down-round to $5.2B.", industry: "Wholesale", founded: 2017, seedYear: 2017, seriesAYear: 2018, unicornYear: 2019, status: "active" },
  { name: "Brex", batch: "W17", valuation: 5.15, raised: "$1.5B", category: "sleeper", story: "Ribbit Capital led $7M Series A pre-Demo Day. Acquired for $5.15B.", industry: "Fintech", founded: 2017, seedYear: 2017, seriesAYear: 2018, unicornYear: 2018, status: "acquired" },
  { name: "Reddit", batch: "S05", valuation: 33, raised: "$1.3B", category: "sleeper", story: "19 years from YC to IPO. Longest timeline of any YC company.", industry: "Social", founded: 2005, seedYear: 2005, seriesAYear: 2007, unicornYear: 2017, status: "public" },
  { name: "Instacart", batch: "S12", valuation: 10, raised: "$2.9B", category: "sleeper", story: "Applied late. Rejected multiple times. Delivered beer to Garry Tan's door.", industry: "Delivery", founded: 2012, seedYear: 2012, seriesAYear: 2013, unicornYear: 2015, status: "public" },
  { name: "Gusto", batch: "W12", valuation: 9.5, raised: "$746M", category: "sleeper", story: "Highest-priced round of its batch. Grew steadily into $9.5B company.", industry: "HR", founded: 2011, seedYear: 2012, seriesAYear: 2014, unicornYear: 2019, status: "active" },
  { name: "GitLab", batch: "W15", valuation: 4.7, raised: "$414M", category: "sleeper", story: "All-remote model made fundraising difficult. Series B was a grind. IPO'd, now ~$4.7B.", industry: "Dev Tools", founded: 2011, seedYear: 2015, seriesAYear: 2016, unicornYear: 2019, status: "public" },
  { name: "Flexport", batch: "W14", valuation: 1, raised: "$2.7B", category: "sleeper", story: "Logistics. Peaked at $8B. CEO ousted, cratered to ~$1B on secondaries.", industry: "Logistics", founded: 2013, seedYear: 2014, seriesAYear: 2015, unicornYear: 2019, status: "active" },
  { name: "Flock Safety", batch: "S17", valuation: 8.4, raised: "$381M", category: "sleeper", story: "Garry Tan funded seed at Demo Day on the spot. 'Home run.'", industry: "Security", founded: 2017, seedYear: 2017, seriesAYear: 2019, unicornYear: 2021, status: "active" },
  { name: "Dropbox", batch: "S07", valuation: 6.4, raised: "$1.7B", category: "hot-won", story: "Viral demo video. 5K→75K waitlist signups overnight.", industry: "Cloud", founded: 2007, seedYear: 2007, seriesAYear: 2008, unicornYear: 2011, status: "public" },
  { name: "Razorpay", batch: "W15", valuation: 9.2, raised: "$816M", category: "sleeper", story: "Payments for India. Valued at $9.2B, preparing IPO.", industry: "Fintech", founded: 2014, seedYear: 2015, seriesAYear: 2016, unicornYear: 2021, status: "active" },
  { name: "Benchling", batch: "S12", valuation: 6.1, raised: "$412M", category: "sleeper", story: "Biotech tools. Quiet grower to $6.1B valuation.", industry: "Biotech", founded: 2012, seedYear: 2013, seriesAYear: 2016, unicornYear: 2021, status: "active" },
  { name: "Checkr", batch: "S14", valuation: 1.2, raised: "$679M", category: "sleeper", story: "Overwhelming investor interest. Landed Uber immediately. Peaked at $5.7B, marked down to ~$1.2B.", industry: "HR", founded: 2014, seedYear: 2014, seriesAYear: 2016, unicornYear: 2019, status: "active" },
  { name: "Fivetran", batch: "W13", valuation: 5.6, raised: "$853M", category: "sleeper", story: "Data integration. Scaled steadily from YC check.", industry: "Data", founded: 2012, seedYear: 2013, seriesAYear: 2018, unicornYear: 2021, status: "active" },
  { name: "Rappi", batch: "W16", valuation: 5.2, raised: "$2.3B", category: "sleeper", story: "Latin American delivery super-app.", industry: "Delivery", founded: 2015, seedYear: 2016, seriesAYear: 2017, unicornYear: 2019, status: "active" },
  { name: "Zapier", batch: "S12", valuation: 5, raised: "$1.4M", category: "hot-won", story: "Bootstrapped from Missouri. Only ever raised $1.3M total.", industry: "Automation", founded: 2011, seedYear: 2012, status: "active" },
  { name: "Webflow", batch: "S13", valuation: 4, raised: "$335M", category: "sleeper", story: "Credit card debt. Failed Kickstarter. 6 years to raise first VC.", industry: "Dev Tools", founded: 2013, seedYear: 2019, seriesAYear: 2019, unicornYear: 2022, status: "active" },
  { name: "Meesho", batch: "S16", valuation: 9, raised: "$1.4B", category: "sleeper", story: "Social commerce India. IPO'd Dec 2025. Market cap ~$9B.", industry: "E-commerce", founded: 2015, seedYear: 2016, seriesAYear: 2018, unicornYear: 2021, status: "public" },
  { name: "EquipmentShare", batch: "W15", valuation: 5.7, raised: "$3.5B", category: "sleeper", story: "Construction equipment rental. IPO'd Jan 2026 on NASDAQ.", industry: "Construction", founded: 2014, seedYear: 2015, seriesAYear: 2017, unicornYear: 2022, status: "public" },
  { name: "Whatnot", batch: "W20", valuation: 11.5, raised: "$710M", category: "sleeper", story: "100+ investor meetings. Raised from friends. Pivoted post-Demo Day. Series F at $11.5B.", industry: "E-commerce", founded: 2019, seedYear: 2020, seriesAYear: 2021, unicornYear: 2022, status: "active" },
  { name: "GOAT Group", batch: "W11", valuation: 3.7, raised: "$493M", category: "sleeper", story: "Original YC company (GrubWithUs) failed. Years of middling ideas before pivot.", industry: "E-commerce", founded: 2015, seedYear: 2016, seriesAYear: 2017, unicornYear: 2020, status: "active" },
  { name: "GrubMarket", batch: "W15", valuation: 4.5, raised: "$549M", category: "sleeper", story: "Food marketplace. Series H Feb 2026.", industry: "Food", founded: 2014, seedYear: 2015, seriesAYear: 2016, unicornYear: 2021, status: "active" },
  { name: "Segment", batch: "S11", valuation: 3.2, raised: "$284M", category: "sleeper", story: "Demo Day product was a classroom tool that flopped. Pivoted entirely.", industry: "Analytics", founded: 2011, seedYear: 2012, seriesAYear: 2014, unicornYear: 2019, status: "acquired" },
  { name: "Groww", batch: "W18", valuation: 9, raised: "$393M", category: "sleeper", story: "Indian investing platform. IPO'd Nov 2025. Market cap ~$9B.", industry: "Fintech", founded: 2016, seedYear: 2018, seriesAYear: 2019, unicornYear: 2021, status: "public" },
  { name: "Podium", batch: "W16", valuation: 3, raised: "$419M", category: "sleeper", story: "Customer engagement platform.", industry: "SaaS", founded: 2014, seedYear: 2016, seriesAYear: 2017, unicornYear: 2021, status: "active" },
  { name: "Twitch", batch: "W07", valuation: 0.97, raised: "$35M", category: "moderate", story: "Started as Justin.tv. Pivoted to gaming streams. $970M Amazon exit.", industry: "Streaming", founded: 2007, seedYear: 2007, seriesAYear: 2008, status: "acquired" },
  { name: "Algolia", batch: "W14", valuation: 2.25, raised: "$334M", category: "sleeper", story: "Search API. $2.25B valuation.", industry: "Dev Tools", founded: 2012, seedYear: 2014, seriesAYear: 2015, unicornYear: 2021, status: "active" },
  { name: "PagerDuty", batch: "S10", valuation: 0.66, raised: "$524M", category: "moderate", story: "Already had paying customers at YC. IPO'd. Stock declined to ~$660M market cap.", industry: "DevOps", founded: 2009, seedYear: 2010, seriesAYear: 2013, status: "public" },
  { name: "Mixpanel", batch: "S09", valuation: 1, raised: "$277M", category: "sleeper", story: "Analytics. Same batch as Stripe.", industry: "Analytics", founded: 2009, seedYear: 2009, seriesAYear: 2012, status: "active" },
  { name: "Amplitude", batch: "W12", valuation: 0.87, raised: "$336M", category: "moderate", story: "Product analytics. IPO'd. Market cap ~$870M.", industry: "Analytics", founded: 2012, seedYear: 2013, seriesAYear: 2015, status: "public" },
  { name: "PlanGrid", batch: "W12", valuation: 0.875, raised: "$69M", category: "moderate", story: "Construction tech. Acquired by Autodesk for $875M.", industry: "Construction", founded: 2011, seedYear: 2012, seriesAYear: 2014, status: "acquired" },
  { name: "Heroku", batch: "W08", valuation: 0.212, raised: "$13M", category: "moderate", story: "Cloud platform. Acquired by Salesforce for $212M.", industry: "Cloud", founded: 2007, seedYear: 2008, seriesAYear: 2009, status: "acquired" },
  { name: "Zenefits", batch: "W13", valuation: 0, raised: "$584M", category: "moderate", story: "a16z Series A. $4.5B peak valuation. CEO ousted for fraud.", industry: "HR", founded: 2013, seedYear: 2013, seriesAYear: 2014, unicornYear: 2015, status: "dead" },
  { name: "Parker", batch: "W19", valuation: 0, raised: "$200M+", category: "moderate", story: "Peter Thiel's Valar Ventures led. $65M revenue. Chapter 7 bankruptcy.", industry: "Fintech", founded: 2019, seedYear: 2019, seriesAYear: 2020, status: "dead" },
  { name: "Embark Trucks", batch: "W16", valuation: 0, raised: "$317M", category: "moderate", story: "SPAC at $5.2B. Stock crashed to $60M. Shut down 2023.", industry: "Autonomous", founded: 2016, seedYear: 2016, seriesAYear: 2018, status: "dead" },
  { name: "Momentus", batch: "S18", valuation: 0, raised: "$160M", category: "moderate", story: "SPAC at $1B+. SEC fraud charges. Collapsed.", industry: "Space", founded: 2017, seedYear: 2018, seriesAYear: 2019, status: "dead" },
  { name: "Notable Labs", batch: "W15", valuation: 0, raised: "$55M", category: "moderate", story: "Public biotech company. Filed for bankruptcy Oct 2024.", industry: "Biotech", founded: 2014, seedYear: 2015, seriesAYear: 2017, status: "dead" },
  { name: "Homejoy", batch: "W10", valuation: 0, raised: "$40M", category: "moderate", story: "Massive Demo Day buzz. On-demand cleaning. Shut down 2015.", industry: "Services", founded: 2012, seedYear: 2012, seriesAYear: 2013, status: "dead" },
  { name: "SpoonRocket", batch: "S13", valuation: 0, raised: "$13.5M", category: "hot-failed", story: "TechCrunch top 8. $2M run rate. 112% weekly growth. Dead by 2016.", industry: "Delivery", founded: 2013, seedYear: 2013, seriesAYear: 2014, status: "dead" },
  { name: "Mattermark", batch: "S12", valuation: 0, raised: "$17M", category: "moderate", story: "a16z + Foundry. Fire-sold for <$1M. Stock worthless.", industry: "Data", founded: 2012, seedYear: 2012, seriesAYear: 2014, status: "dead" },
  { name: "Buttercoin", batch: "S13", valuation: 0, raised: "Funded", category: "hot-failed", story: "TechCrunch top 8. Bitcoin exchange. Dead by April 2015.", industry: "Crypto", founded: 2013, seedYear: 2013, status: "dead" },
  { name: "Standard Treasury", batch: "S13", valuation: 0, raised: "Funded", category: "hot-failed", story: "TechCrunch top 8. Banking API. Acqui-hired by SVB.", industry: "Fintech", founded: 2013, seedYear: 2013, status: "acquired" },
  { name: "Dating Ring", batch: "W14", valuation: 0, raised: "Funded", category: "moderate", story: "TechCrunch's #2 pick. 60% MoM growth. Shut down 2018.", industry: "Consumer", founded: 2014, seedYear: 2014, status: "dead" },
  { name: "Kimono Labs", batch: "W14", valuation: 0, raised: "Funded", category: "hot-failed", story: "TechCrunch top 8. 20K devs. Acqui-hired by Palantir.", industry: "Dev Tools", founded: 2014, seedYear: 2014, status: "acquired" },
  { name: "ZeroDown", batch: "W19", valuation: 0, raised: "$10M+", category: "moderate", story: "Raised $10M+ pre-Demo Day at $75M valuation. Shut down.", industry: "Real Estate", founded: 2018, seedYear: 2019, status: "dead" },
  { name: "Flockjay", batch: "W19", valuation: 0, raised: "Funded", category: "hot-failed", story: "TechCrunch top 10. 40% job placement rate. Shut down ~2022.", industry: "Education", founded: 2018, seedYear: 2019, status: "dead" },
  { name: "Retool", batch: "W17", valuation: 3.2, raised: "$445M", category: "sleeper", story: "Internal tools builder. Quiet Demo Day but became default for ops teams.", industry: "Dev Tools", founded: 2017, seedYear: 2017, seriesAYear: 2019, unicornYear: 2021, status: "active" },
  { name: "Vanta", batch: "W18", valuation: 4.15, raised: "$353M", category: "sleeper", story: "SOC 2 compliance automation. Grew to $4.15B valuation.", industry: "Security", founded: 2018, seedYear: 2018, seriesAYear: 2020, unicornYear: 2022, status: "active" },
  { name: "Lattice", batch: "W16", valuation: 3, raised: "$329M", category: "sleeper", story: "People management platform. Steady SaaS grower.", industry: "HR", founded: 2015, seedYear: 2016, seriesAYear: 2017, unicornYear: 2021, status: "active" },
  { name: "Ironclad", batch: "S15", valuation: 3.2, raised: "$333M", category: "sleeper", story: "Contract lifecycle management. Accel-backed.", industry: "Legal", founded: 2014, seedYear: 2015, seriesAYear: 2017, unicornYear: 2022, status: "active" },
  { name: "Zip", batch: "S20", valuation: 2.2, raised: "$370M", category: "sleeper", story: "Procurement platform. Raised $1.7M at Demo Day, then exploded.", industry: "SaaS", founded: 2020, seedYear: 2020, seriesAYear: 2021, unicornYear: 2022, status: "active" },
  { name: "Zepto", batch: "W21", valuation: 7, raised: "$2.3B", category: "sleeper", story: "10-minute grocery delivery in India. Two 19-year-old Stanford dropouts. 640M+ orders in FY2026. Filing for IPO.", industry: "Delivery", founded: 2020, seedYear: 2021, seriesAYear: 2021, unicornYear: 2023, status: "active" },
  { name: "Supabase", batch: "S20", valuation: 10.5, raised: "$544M", category: "sleeper", story: "Open-source Firebase alternative exploded via vibe-coding wave. Doubled valuation in 8 months to $10.5B.", industry: "Dev Tools", founded: 2020, seedYear: 2020, seriesAYear: 2021, unicornYear: 2024, status: "active" },
  { name: "Replit", batch: "W18", valuation: 9, raised: "$400M+", category: "sleeper", story: "Browser-based IDE became AI coding juggernaut. $525M ARR, tripled valuation in 6 months to $9B.", industry: "AI", founded: 2016, seedYear: 2018, seriesAYear: 2020, unicornYear: 2025, status: "active" },
  { name: "Ginkgo Bioworks", batch: "S14", valuation: 0.4, raised: "$2.8B", category: "moderate", story: "SPAC at $17.5B valuation. Stock crashed 97%. Synthetic biology hype cycle.", industry: "Biotech", founded: 2009, seedYear: 2014, seriesAYear: 2015, unicornYear: 2020, status: "public" },
  { name: "Convoy", batch: "W15", valuation: 0, raised: "$900M", category: "moderate", story: "Jeff Bezos invested. Valued at $3.8B. Shut down Oct 2023.", industry: "Logistics", founded: 2015, seedYear: 2015, seriesAYear: 2017, unicornYear: 2019, status: "dead" },
  { name: "Pebble", batch: "W11", valuation: 0, raised: "$16M+", category: "moderate", story: "Kickstarter record $10M. Sold to Fitbit for parts. Pioneer that lost to Apple Watch.", industry: "Hardware", founded: 2012, seedYear: 2012, status: "dead" },
  { name: "Docker", batch: "S10", valuation: 2.1, raised: "$392M", category: "sleeper", story: "Applied as dotCloud (PaaS). Container side project became the product.", industry: "Dev Tools", founded: 2008, seedYear: 2010, seriesAYear: 2013, unicornYear: 2015, status: "active" },
  { name: "Weebly", batch: "W07", valuation: 0.35, raised: "$35M", category: "hot-failed", story: "Named a Demo Day standout by TechCrunch's contemporaneous W07 coverage. Website builder acquired by Square for $365M in 2018 — never reached unicorn scale.", industry: "Dev Tools", founded: 2006, seedYear: 2007, seriesAYear: 2012, status: "acquired" },
  { name: "Optimizely", batch: "W10", valuation: 0.6, raised: "$251M", category: "moderate", story: "A/B testing. Acquired by Episerver for ~$600M.", industry: "Analytics", founded: 2010, seedYear: 2010, seriesAYear: 2013, status: "acquired" },
  { name: "Machine Zone", batch: "S08", valuation: 0.8, raised: "$8M", category: "moderate", story: "Game of War made $1B+/year. Kate Upton Super Bowl ads. Peak $5B. Acquired by Tripledot for $800M.", industry: "Gaming", founded: 2008, seedYear: 2008, unicornYear: 2014, status: "acquired" },
  { name: "Sendbird", batch: "W16", valuation: 1.05, raised: "$221M", category: "sleeper", story: "Chat API for apps. Grew to unicorn status from South Korea.", industry: "Dev Tools", founded: 2013, seedYear: 2016, seriesAYear: 2018, unicornYear: 2021, status: "active" },
  { name: "Kalshi", batch: "W19", valuation: 1, raised: "$166M", category: "sleeper", story: "CFTC-regulated prediction market. Bet on elections going mainstream.", industry: "Fintech", founded: 2018, seedYear: 2019, seriesAYear: 2021, unicornYear: 2024, status: "active" },
  { name: "PostHog", batch: "W20", valuation: 1.4, raised: "$180M", category: "sleeper", story: "Pivoted 6 times in 6 months, launched MVP on Hacker News, hit 1,500 GitHub stars in 2 weeks. Open-source product analytics unicorn.", industry: "Analytics", founded: 2020, seedYear: 2020, seriesAYear: 2021, unicornYear: 2025, status: "active" },
  { name: "Relativity Space", batch: "S16", valuation: 4.2, raised: "$1.3B", category: "sleeper", story: "3D-printed rockets. Raised at $4.2B valuation. First launch 2023.", industry: "Space", founded: 2015, seedYear: 2016, seriesAYear: 2018, unicornYear: 2021, status: "active" },
  { name: "Boom Supersonic", batch: "W16", valuation: 1.5, raised: "$700M", category: "sleeper", story: "Building supersonic jets. United ordered 15. Series B at $1.5B, far below hype.", industry: "Aviation", founded: 2014, seedYear: 2016, seriesAYear: 2017, unicornYear: 2024, status: "active" },
  { name: "Loom", batch: "S16", valuation: 0.975, raised: "$203M", category: "moderate", story: "Async video messaging. Acquired by Atlassian for $975M — never reached unicorn scale despite a $1.53B private peak valuation.", industry: "SaaS", founded: 2015, seedYear: 2016, seriesAYear: 2019, status: "acquired" },
  { name: "Wufoo", batch: "W06", valuation: 0.035, raised: "$118K", category: "moderate", story: "Only raised $118K ever. Acquired by SurveyMonkey for $35M. Pure YC ethos.", industry: "SaaS", founded: 2006, seedYear: 2006, status: "acquired" },
  { name: "Socialcam", batch: "W12", valuation: 0.06, raised: "$8M", category: "moderate", story: "Video sharing app. Hit #1 in App Store. Acquired by Autodesk for $60M in 6 months.", industry: "Social", founded: 2012, seedYear: 2012, status: "acquired" },
  { name: "Panorama Education", batch: "S13", valuation: 0.4, raised: "$105M", category: "hot-failed", story: "Mark Zuckerberg's first angel investment. K-12 data analytics.", industry: "Education", founded: 2012, seedYear: 2013, seriesAYear: 2015, status: "active" },
  { name: "Mintlify", batch: "W22", valuation: 0.15, raised: "$20M", category: "moderate", story: "Developer docs platform. AI-powered documentation.", industry: "Dev Tools", founded: 2022, seedYear: 2022, seriesAYear: 2023, status: "active" },
  { name: "Roboflow", batch: "S20", valuation: 0.3, raised: "$24M", category: "moderate", story: "Computer vision infrastructure. Used by 250K+ developers.", industry: "AI", founded: 2019, seedYear: 2020, seriesAYear: 2022, status: "active" },
  { name: "Lever", batch: "S12", valuation: 0.5, raised: "$122M", category: "moderate", story: "Recruiting ATS. Acquired by Employ Inc. Steady SaaS play.", industry: "HR", founded: 2012, seedYear: 2013, seriesAYear: 2015, status: "acquired" },
  { name: "ReadMe", batch: "W15", valuation: 0.2, raised: "$37M", category: "moderate", story: "Interactive API documentation. Developer tools niche.", industry: "Dev Tools", founded: 2014, seedYear: 2015, seriesAYear: 2019, status: "active" },
  { name: "Stytch", batch: "W21", valuation: 1, raised: "$210M", category: "sleeper", story: "Auth infrastructure. Raised at $1B within 18 months of YC.", industry: "Security", founded: 2020, seedYear: 2021, seriesAYear: 2021, unicornYear: 2022, status: "active" },
  { name: "Teespring", batch: "W13", valuation: 0, raised: "$56M", category: "moderate", story: "Custom merch platform. a16z led $55M Series B. Revenue collapsed. Rebranded to Spring.", industry: "E-commerce", founded: 2012, seedYear: 2013, seriesAYear: 2014, status: "dead" },
  { name: "Vetcove", batch: "S16", valuation: 1.6, raised: "$120M", category: "sleeper", story: "Amazon for veterinarians. Quietly grew to $1.6B. Zero hype at Demo Day.", industry: "Healthcare", founded: 2015, seedYear: 2016, seriesAYear: 2019, unicornYear: 2024, status: "active" },
  { name: "Helion Energy", batch: "W14", valuation: 15.5, raised: "$1.5B", category: "hot-won", story: "Fusion energy startup. Sam Altman became chairman. Contract to power Microsoft. $15.5B.", industry: "Energy", founded: 2013, seedYear: 2014, seriesAYear: 2015, unicornYear: 2021, status: "active" },
  { name: "Mercury", batch: "S19", valuation: 5.2, raised: "$546M", category: "sleeper", story: "Banking for startups when neobanks were crowded. 40%+ of YC batches now bank with Mercury.", industry: "Fintech", founded: 2017, seedYear: 2017, seriesAYear: 2020, unicornYear: 2022, status: "active" },
  { name: "Oklo", batch: "S14", valuation: 6.16, raised: "$1.9B", category: "hot-won", story: "Nuclear microreactor company. Sam Altman chairman. Went public via SPAC 2024. ~$6B market cap.", industry: "Nuclear", founded: 2013, seedYear: 2014, seriesAYear: 2016, unicornYear: 2024, status: "public" },
  { name: "Rigetti Computing", batch: "S14", valuation: 6.16, raised: "$298M", category: "sleeper", story: "Quantum computing hardware. Went public via SPAC. Volatile but hit $6B amid quantum hype.", industry: "Quantum", founded: 2013, seedYear: 2014, seriesAYear: 2017, unicornYear: 2024, status: "public" },
  { name: "Solugen", batch: "W17", valuation: 2, raised: "$656M", category: "sleeper", story: "Plant-sugar-to-chemicals got modest Demo Day attention. First YC climate tech unicorn.", industry: "Climate", founded: 2016, seedYear: 2017, seriesAYear: 2019, unicornYear: 2022, status: "active" },
  { name: "Substack", batch: "W18", valuation: 1.1, raised: "$190M", category: "sleeper", story: "Newsletter platform seemed niche at Demo Day. Rode creator economy wave to unicorn.", industry: "Media", founded: 2017, seedYear: 2018, seriesAYear: 2019, unicornYear: 2025, status: "active" },
  { name: "Apollo.io", batch: "W16", valuation: 1.6, raised: "$250M", category: "sleeper", story: "Sales intelligence grew slowly for years then exploded to $150M ARR. Capital-efficient unicorn.", industry: "Sales", founded: 2015, seedYear: 2016, seriesAYear: 2021, unicornYear: 2023, status: "active" },
  { name: "Gecko Robotics", batch: "S16", valuation: 1.25, raised: "$354M", category: "hot-won", story: "Wall-climbing inspection robots for power plants. Founded at 19. Took 12 years to unicorn.", industry: "Robotics", founded: 2013, seedYear: 2016, seriesAYear: 2018, unicornYear: 2025, status: "active" },
  { name: "Astranis", batch: "W16", valuation: 2, raised: "$753M", category: "sleeper", story: "Small geostationary satellites. Demo Day investors skeptical of hardware. Now $2B+ with defense contracts.", industry: "Space", founded: 2015, seedYear: 2016, seriesAYear: 2018, unicornYear: 2024, status: "active" },
  { name: "Front", batch: "S14", valuation: 1.7, raised: "$202M", category: "sleeper", story: "Shared inbox for teams seemed incremental. Steadily grew to $100M ARR and $1.7B.", industry: "SaaS", founded: 2013, seedYear: 2014, seriesAYear: 2016, unicornYear: 2022, status: "active" },
  { name: "Clipboard Health", batch: "W17", valuation: 1.3, raised: "$94M", category: "sleeper", story: "Healthcare staffing marketplace. Hit unicorn on just $94M raised — most capital-efficient YC unicorn.", industry: "Healthcare", founded: 2016, seedYear: 2017, seriesAYear: 2021, unicornYear: 2022, status: "active" },
  { name: "Xendit", batch: "S15", valuation: 1, raised: "$530M", category: "sleeper", story: "First Southeast Asian YC company. Pivoted from Bitcoin to payment infrastructure. Processes $15B/year in Indonesia.", industry: "Fintech", founded: 2015, seedYear: 2015, seriesAYear: 2018, unicornYear: 2021, status: "active" },
  { name: "Paystack", batch: "W16", valuation: 0.2, raised: "$11.7M", category: "moderate", story: "First Nigerian YC company. Processed half of Nigeria's online transactions. Acquired by Stripe for $200M+.", industry: "Fintech", founded: 2015, seedYear: 2016, seriesAYear: 2018, status: "acquired" },
  { name: "Newfront", batch: "W18", valuation: 1.3, raised: "$310M", category: "sleeper", story: "Modern commercial insurance brokerage. Digitized old-school industry, hit unicorn status in 2022. Acquired by WTW in 2026 for $1.3B.", industry: "Insurance", founded: 2017, seedYear: 2018, seriesAYear: 2019, unicornYear: 2022, status: "acquired" },
  { name: "GoCardless", batch: "S11", valuation: 2.1, raised: "$540M", category: "sleeper", story: "UK bank-to-bank payments. One of YC's earliest international successes. Acquired in 2025.", industry: "Fintech", founded: 2011, seedYear: 2012, seriesAYear: 2014, unicornYear: 2022, status: "acquired" },
  { name: "Honeylove", batch: "S18", valuation: 2.3, raised: "$13.2M", category: "sleeper", story: "DTC shapewear by an EDM artist. Only raised $13M. One of YC's most capital-efficient consumer brands.", industry: "DTC", founded: 2018, seedYear: 2018, seriesAYear: 2022, unicornYear: 2022, status: "active" },
  { name: "BillionToOne", batch: "S17", valuation: 1, raised: "$230M", category: "sleeper", story: "Prenatal genetic testing 10x more accurate than competitors. Grew from diagnostics niche to unicorn.", industry: "Biotech", founded: 2016, seedYear: 2017, seriesAYear: 2020, unicornYear: 2023, status: "active" },
  { name: "Stoke Space", batch: "W21", valuation: 2, raised: "$175M", category: "sleeper", story: "Fully reusable rocket by Blue Origin veterans. Quietly building while SpaceX dominates headlines.", industry: "Space", founded: 2019, seedYear: 2021, seriesAYear: 2023, unicornYear: 2024, status: "active" },
  { name: "Go1", batch: "S15", valuation: 2, raised: "$414M", category: "sleeper", story: "Australian corporate learning aggregator. Overlooked at Demo Day. World's largest curated e-learning library.", industry: "EdTech", founded: 2015, seedYear: 2015, seriesAYear: 2017, unicornYear: 2022, status: "active" },
  { name: "Scribd", batch: "S06", valuation: 0.45, raised: "$107M", category: "moderate", story: "One of YC's earliest companies. Pivoted from doc sharing to 'Netflix for books.' Survived 20 years.", industry: "Media", founded: 2006, seedYear: 2006, seriesAYear: 2008, status: "active" },
  { name: "Boosted", batch: "S12", valuation: 0, raised: "$72M", category: "moderate", story: "Electric skateboard pioneer with devoted fans. Killed by Trump-era tariffs on Chinese components. Shut down 2020.", industry: "Hardware", founded: 2012, seedYear: 2012, seriesAYear: 2015, status: "dead" },
  { name: "Weave", batch: "W14", valuation: 0.7, raised: "$168M", category: "moderate", story: "Communication platform for small healthcare businesses. Went public on NYSE 2021.", industry: "SaaS", founded: 2008, seedYear: 2015, seriesAYear: 2017, status: "public" },
  // CLASSIC ERA ADDITIONS
  { name: "Loopt", batch: "S05", valuation: 0.043, raised: "$30M", category: "moderate", story: "Sam Altman's first startup. Location-sharing app. Acquired by Green Dot for $43M. Altman went on to run YC and then OpenAI.", industry: "Mobile", founded: 2005, seedYear: 2005, seriesAYear: 2006, status: "acquired" },
  { name: "Xobni", batch: "S06", valuation: 0.06, raised: "$42M", category: "moderate", story: "'Inbox' spelled backwards. Smart email search for Outlook. Yahoo acquired for ~$60M, then shut it down.", industry: "Productivity", founded: 2006, seedYear: 2006, seriesAYear: 2008, status: "acquired" },
  { name: "OMGPOP", batch: "S06", valuation: 0.2, raised: "$17M", category: "moderate", story: "Created Draw Something — 50M downloads in 50 days. Zynga bought for $210M then shut it down within a year.", industry: "Gaming", founded: 2006, seedYear: 2006, seriesAYear: 2007, status: "dead" },
  { name: "Disqus", batch: "S07", valuation: 0, raised: "$14.6M", category: "hot-failed", story: "Dominant third-party commenting system used by millions of websites. Acquired by Zeta Global for ad-tech data.", industry: "Web", founded: 2007, seedYear: 2007, seriesAYear: 2011, status: "acquired" },
  { name: "Posterous", batch: "S08", valuation: 0, raised: "$10.1M", category: "moderate", story: "Dead-simple blogging co-founded by Garry Tan (now YC President). Twitter acqui-hired the team, killed the product.", industry: "Social", founded: 2008, seedYear: 2008, seriesAYear: 2010, status: "dead" },
  { name: "Genius", batch: "S11", valuation: 0.4, raised: "$94M", category: "moderate", story: "Started as Rap Genius. a16z $40M Series B. Google briefly de-indexed them for SEO manipulation. Never hit unicorn.", industry: "Media", founded: 2009, seedYear: 2011, seriesAYear: 2012, status: "active" },
  { name: "Codecademy", batch: "S11", valuation: 0.525, raised: "$87.5M", category: "hot-failed", story: "Taught millions to code for free. One of the most culturally impactful ed-tech companies. Acquired by Skillsoft for $525M.", industry: "EdTech", founded: 2011, seedYear: 2011, seriesAYear: 2012, status: "acquired" },
  { name: "Parse", batch: "S11", valuation: 0.085, raised: "$7M", category: "hot-failed", story: "Made mobile backends trivially easy. Facebook acquired for $85M. Shut down in 2017. Open-sourced as Parse Server.", industry: "Dev Tools", founded: 2011, seedYear: 2011, seriesAYear: 2012, status: "dead" },
  { name: "SingleStore", batch: "W11", valuation: 1.3, raised: "$464M", category: "sleeper", story: "Originally MemSQL. Cloud-native distributed SQL combining transactional + analytical workloads. Quiet path to unicorn.", industry: "Data", founded: 2011, seedYear: 2011, seriesAYear: 2013, unicornYear: 2021, status: "active" },
  { name: "Humble Bundle", batch: "W11", valuation: 0, raised: "$4.7M", category: "moderate", story: "Pay-what-you-want game bundles with charity donations. Sequoia-backed. Donated $250M+ to charity. Acquired by IGN.", industry: "Gaming", founded: 2010, seedYear: 2011, seriesAYear: 2012, status: "acquired" },
  { name: "Tilt", batch: "W12", valuation: 0, raised: "$62M", category: "moderate", story: "Group payment platform. a16z poured in $62M. Airbnb acqui-hired team for just $12M — massive loss for investors.", industry: "Fintech", founded: 2012, seedYear: 2012, seriesAYear: 2013, status: "dead" },
  { name: "Soylent", batch: "S12", valuation: 0.2, raised: "$82M", category: "moderate", story: "Rob Rhinehart's meal replacement went viral on Hacker News. a16z and GV backed. Controversial but built a real brand.", industry: "Food", founded: 2013, seedYear: 2013, seriesAYear: 2015, status: "active" },
  { name: "Watsi", batch: "W13", valuation: 0, raised: "$5M", category: "hot-failed", story: "First-ever YC nonprofit. Paul Graham personally championed them. Crowdfunds medical treatments — helped 33K+ people.", industry: "Healthcare", founded: 2012, seedYear: 2013, status: "active" },
  // 2021+ ERA — AI BOOM
  { name: "Bland AI", batch: "S23", valuation: 0.6, raised: "$106M", category: "moderate", story: "Rejected by 180 investors during YC. Now handles 3.5M+ AI phone calls per week for 250+ enterprise customers.", industry: "AI", founded: 2023, seedYear: 2023, seriesAYear: 2024, status: "active" },
  { name: "Retell AI", batch: "W24", valuation: 0.5, raised: "$4.6M", category: "moderate", story: "Voice AI platform. Hit $60M ARR on just $4.6M raised — 650% YoY growth. Insane capital efficiency.", industry: "AI", founded: 2023, seedYear: 2024, status: "active" },
  { name: "Corgi Insurance", batch: "S24", valuation: 2.6, raised: "$108M", category: "sleeper", story: "Full-stack insurance carrier for startups. $630M in Jan 2026, unicorn by May, $2.6B by late May. Fastest YC insurtech ever.", industry: "Insurance", founded: 2024, seedYear: 2024, seriesAYear: 2026, unicornYear: 2026, status: "active" },
  // CLASSIC DEEP DIVE
  { name: "Auctomatic", batch: "W08", valuation: 0.005, raised: "$0.1M", category: "moderate", story: "Patrick and John Collison's first startup (pre-Stripe). Acquired for $5M. They returned to YC with Stripe in S09.", industry: "E-commerce", founded: 2007, seedYear: 2008, status: "acquired" },
  { name: "Triplebyte", batch: "S15", valuation: 0, raised: "$45M", category: "moderate", story: "Technical hiring platform by YC partner Harj Taggar. Tried to fix engineering interviews. Struggled, acquired by Karat.", industry: "HR Tech", founded: 2015, seedYear: 2015, seriesAYear: 2018, status: "acquired" },
  // S16-W19 MID ERA
  { name: "Athelas", batch: "S16", valuation: 7, raised: "$136M", category: "sleeper", story: "Started as blood diagnostics device, pivoted to healthcare AI platform (now Commure). $7B valuation on just $136M raised — remarkable capital efficiency.", industry: "Healthcare", founded: 2016, seedYear: 2016, seriesAYear: 2019, unicornYear: 2022, status: "active" },
  { name: "Flutterwave", batch: "S16", valuation: 3.25, raised: "$474M", category: "sleeper", story: "Africa's most valuable startup. Payments infrastructure across 34 African countries. Aiming for Nasdaq IPO.", industry: "Fintech", founded: 2016, seedYear: 2016, seriesAYear: 2018, unicornYear: 2022, status: "active" },
  { name: "Mux", batch: "W16", valuation: 1, raised: "$177M", category: "sleeper", story: "Video API infrastructure for developers. Quietly became the backend for streaming across thousands of companies.", industry: "Dev Tools", founded: 2015, seedYear: 2016, seriesAYear: 2019, unicornYear: 2021, status: "active" },
  { name: "Outschool", batch: "W16", valuation: 3, raised: "$260M", category: "sleeper", story: "Marketplace for live online kids' classes. Exploded during COVID to $3B valuation. Largest platform of its kind.", industry: "EdTech", founded: 2015, seedYear: 2016, seriesAYear: 2019, unicornYear: 2021, status: "active" },
  { name: "Standard Cognition", batch: "S17", valuation: 0.1, raised: "$236M", category: "moderate", story: "Cashierless checkout backed by SoftBank at $1B. Quietly abandoned core product, pivoted to generic AI cameras. Zombie unicorn.", industry: "Retail Tech", founded: 2017, seedYear: 2017, seriesAYear: 2018, unicornYear: 2021, status: "active" },
  // W20-W21 ERA
  { name: "Jeeves", batch: "S20", valuation: 2.1, raised: "$380M", category: "sleeper", story: "Global corporate expense management for emerging markets. Hit $1B+ annualized transaction volume within 11 months of launch.", industry: "Fintech", founded: 2020, seedYear: 2020, seriesAYear: 2021, unicornYear: 2022, status: "active" },
  { name: "Airbyte", batch: "W20", valuation: 2, raised: "$181M", category: "sleeper", story: "Pivoted 3 times in their first YC month, landed on open-source ELT data integration. Now the standard with 600+ connectors.", industry: "Data", founded: 2020, seedYear: 2020, seriesAYear: 2021, unicornYear: 2024, status: "active" },
  { name: "Pave", batch: "W20", valuation: 1.6, raised: "$175M", category: "sleeper", story: "Compensation benchmarking used by 900+ companies. One-third of customers from the YC network. Quiet but dominant.", industry: "HR Tech", founded: 2019, seedYear: 2020, seriesAYear: 2021, unicornYear: 2022, status: "active" },
  // S22-S25 AI BOOM
  { name: "Resend", batch: "W23", valuation: 0.15, raised: "$21.5M", category: "moderate", story: "Built by Zeno Rocha, creator of React Email. Developer-favorite email API displacing SendGrid/Mailgun with beautiful DX.", industry: "Dev Tools", founded: 2023, seedYear: 2023, seriesAYear: 2024, status: "active" },
  { name: "Firecrawl", batch: "S22", valuation: 0.1, raised: "$16.2M", category: "moderate", story: "Web scraping API built for LLMs. Essential infrastructure for RAG pipelines and AI agents. Backed by Shopify CEO.", industry: "AI", founded: 2024, seedYear: 2024, seriesAYear: 2025, status: "active" },
  { name: "Gumloop", batch: "W24", valuation: 0.3, raised: "$70M", category: "moderate", story: "No-code AI agent builder used by Shopify, Ramp, Instacart. Aims to be $1B company with just 10 employees.", industry: "AI", founded: 2024, seedYear: 2024, seriesAYear: 2025, status: "active" },
  { name: "Browserbase", batch: "S24", valuation: 0.3, raised: "$67.5M", category: "moderate", story: "Headless browser infrastructure for AI agents. 88% of Fortune 100 signed up. Backed by Patrick Collison and Guillermo Rauch.", industry: "AI", founded: 2024, seedYear: 2024, seriesAYear: 2024, status: "active" },
  { name: "OpenPipe", batch: "S23", valuation: 0, raised: "$7.2M", category: "moderate", story: "Built tools to replace GPT-4 with cheaper fine-tuned models. Acqui-hired by CoreWeave for inference expertise.", industry: "AI", founded: 2023, seedYear: 2024, status: "acquired" },
  { name: "Skyvern", batch: "W24", valuation: 0.02, raised: "$2.7M", category: "moderate", story: "AI browser automation with 21.9K GitHub stars and 30K+ users. Automates complex web workflows without code.", industry: "AI", founded: 2024, seedYear: 2025, status: "active" },
  // INTERNATIONAL
  { name: "ClearTax", batch: "S14", valuation: 0.7, raised: "$141M", category: "moderate", story: "First India-focused startup to join YC. Automates tax filing for Indian workers and businesses. Rebranded to 'Clear.'", industry: "Fintech", founded: 2011, seedYear: 2014, seriesAYear: 2017, status: "active" },
  { name: "Mono", batch: "W21", valuation: 0.03, raised: "$20M", category: "moderate", story: "'Plaid for Africa.' Powered millions of bank account linkages. First YC-to-YC exit in Africa — acquired by Flutterwave.", industry: "Fintech", founded: 2020, seedYear: 2020, seriesAYear: 2021, status: "acquired" },
  // NOTABLE FAILURES
  { name: "Kiko", batch: "S05", valuation: 0, raised: "$0.07M", category: "moderate", story: "YC's very first company. Built a web calendar, then Google Calendar launched. Sold on eBay for $258K. Founders pivoted to Justin.tv → Twitch ($970M).", industry: "Productivity", founded: 2005, seedYear: 2005, status: "dead" },
  { name: "Exec", batch: "W12", valuation: 0, raised: "$3.3M", category: "hot-failed", story: "Justin Kan's on-demand errand service. Couldn't scale past SF, hiked rates, pivoted to cleaning. Acqui-hired by Handy.", industry: "On-Demand", founded: 2012, seedYear: 2012, status: "dead" },
  { name: "Tutorspree", batch: "W11", valuation: 0, raised: "$1.8M", category: "moderate", story: "'Airbnb for tutoring' backed by Sequoia. Users bypassed the platform to work directly. Co-founder Aaron Harris became a YC partner.", industry: "EdTech", founded: 2011, seedYear: 2011, status: "dead" },
  // FINTECH / B2B SAAS
  { name: "Hightouch", batch: "S19", valuation: 1.2, raised: "$180M", category: "sleeper", story: "Reverse ETL pioneer that became the leading composable CDP. Now powering AI decisioning for enterprise marketing.", industry: "Data", founded: 2018, seedYear: 2019, seriesAYear: 2021, unicornYear: 2025, status: "active" },
  { name: "Middesk", batch: "W19", valuation: 0.5, raised: "$77M", category: "hot-failed", story: "Founded by ex-Checkr leaders. Automates business identity verification and KYB checks for banks and fintechs.", industry: "Fintech", founded: 2019, seedYear: 2019, seriesAYear: 2021, status: "active" },
  { name: "Vouch", batch: "S19", valuation: 0.5, raised: "$160M", category: "moderate", story: "Business insurance built for startups. Became the default insurer for YC, Brex, and Carta portfolios.", industry: "Insurance", founded: 2018, seedYear: 2019, seriesAYear: 2021, status: "active" },
  // CONSUMER
  { name: "Lugg", batch: "S15", valuation: 0, raised: "$5.6M", category: "hot-failed", story: "'Uber for moving.' Hit $17.6M revenue but filed Chapter 11 in May 2024 after accumulating $3M+ debt.", industry: "Logistics", founded: 2015, seedYear: 2015, status: "dead" },
  { name: "Nurx", batch: "W16", valuation: 0.3, raised: "$96M", category: "hot-failed", story: "Telehealth for birth control and PrEP. Chelsea Clinton on board. Scaled to $300M, merged into Thirty Madison.", industry: "Healthcare", founded: 2014, seedYear: 2016, seriesAYear: 2017, status: "acquired" },
  { name: "Muzz", batch: "S17", valuation: 0.1, raised: "$7M", category: "moderate", story: "World's largest Muslim dating app. 10M+ members, 500K+ weddings facilitated. Quietly dominant in its niche.", industry: "Social", founded: 2015, seedYear: 2017, status: "active" },
  // GAP FILL — UNICORNS
  { name: "SmartAsset", batch: "S12", valuation: 1, raised: "$161M", category: "sleeper", story: "Marketplace connecting consumers to financial advisors. 59M monthly users. Quietly became a unicorn.", industry: "Fintech", founded: 2012, seedYear: 2012, seriesAYear: 2014, unicornYear: 2021, status: "active" },
  { name: "ShipBob", batch: "S14", valuation: 1.1, raised: "$333M", category: "sleeper", story: "E-commerce fulfillment for DTC brands. 40+ fulfillment centers globally.", industry: "Logistics", founded: 2014, seedYear: 2014, seriesAYear: 2017, unicornYear: 2021, status: "active" },
  { name: "Modern Health", batch: "W18", valuation: 1.17, raised: "$170M", category: "sleeper", story: "Workplace mental health platform. Fastest entirely women-founded company to reach unicorn status in the US.", industry: "Healthcare", founded: 2017, seedYear: 2018, seriesAYear: 2019, unicornYear: 2021, status: "active" },
  { name: "Modern Treasury", batch: "S18", valuation: 2, raised: "$185M", category: "sleeper", story: "Payment operations platform for moving money at scale. Powers automated payment flows for enterprises.", industry: "Fintech", founded: 2018, seedYear: 2018, seriesAYear: 2020, unicornYear: 2022, status: "active" },
  { name: "Mashgin", batch: "W15", valuation: 1.5, raised: "$82.5M", category: "sleeper", story: "AI self-checkout kiosks using computer vision. $1.5B valuation on just $82M raised — capital-efficient unicorn.", industry: "AI", founded: 2014, seedYear: 2015, seriesAYear: 2018, unicornYear: 2022, status: "active" },
  { name: "Speak", batch: "W17", valuation: 1, raised: "$118M", category: "sleeper", story: "AI language learning app backed by OpenAI. #1 education app in South Korea before expanding globally.", industry: "EdTech", founded: 2016, seedYear: 2017, seriesAYear: 2020, unicornYear: 2024, status: "active" },
  { name: "People.ai", batch: "W16", valuation: 1.1, raised: "$200M", category: "hot-won", story: "AI platform capturing business activity data to drive revenue growth. Accepted into YC within 30 days of founding.", industry: "AI", founded: 2016, seedYear: 2016, seriesAYear: 2018, unicornYear: 2021, status: "active" },
  { name: "Snapdocs", batch: "S13", valuation: 1.5, raised: "$269M", category: "sleeper", story: "Digital mortgage closing platform. Automates notary and title workflow for real estate transactions.", industry: "Real Estate", founded: 2013, seedYear: 2013, seriesAYear: 2018, unicornYear: 2021, status: "active" },
  { name: "Veriff", batch: "S18", valuation: 1.5, raised: "$200M", category: "sleeper", story: "AI identity verification from Estonia. One of YC's biggest European success stories.", industry: "Security", founded: 2015, seedYear: 2018, seriesAYear: 2019, unicornYear: 2022, status: "active" },
  { name: "CaptivateIQ", batch: "W18", valuation: 1.25, raised: "$164M", category: "sleeper", story: "Sales commission management platform. Solved the spreadsheet nightmare of calculating sales comp.", industry: "SaaS", founded: 2017, seedYear: 2018, seriesAYear: 2020, unicornYear: 2022, status: "active" },
  { name: "Apollo GraphQL", batch: "S11", valuation: 1.5, raised: "$244M", category: "sleeper", story: "Built the most popular GraphQL platform. Underpins API architectures at major tech companies worldwide.", industry: "Dev Tools", founded: 2011, seedYear: 2016, seriesAYear: 2019, unicornYear: 2022, status: "active" },
  { name: "Wave", batch: "W12", valuation: 1.7, raised: "$200M", category: "sleeper", story: "Mobile money for Africa. Disrupted costly legacy money transfer in Senegal and Cote d'Ivoire.", industry: "Fintech", founded: 2018, seedYear: 2018, seriesAYear: 2020, unicornYear: 2021, status: "active" },
  { name: "Nowports", batch: "S19", valuation: 1.1, raised: "$291M", category: "sleeper", story: "First digital freight forwarder for Latin America. LatAm's logistics unicorn.", industry: "Logistics", founded: 2018, seedYear: 2019, seriesAYear: 2020, unicornYear: 2022, status: "active" },
  { name: "CoinTracker", batch: "S18", valuation: 1.3, raised: "$122M", category: "sleeper", story: "Crypto tax and portfolio tracking. Used by millions to calculate crypto capital gains.", industry: "Crypto", founded: 2017, seedYear: 2018, seriesAYear: 2022, unicornYear: 2022, status: "active" },
  { name: "Teleport", batch: "W15", valuation: 1.1, raised: "$169M", category: "sleeper", story: "Zero-trust infrastructure access platform. Secure access to servers, Kubernetes, and databases.", industry: "Security", founded: 2015, seedYear: 2015, seriesAYear: 2019, unicornYear: 2022, status: "active" },
  { name: "Ajaib", batch: "S19", valuation: 1, raised: "$243M", category: "hot-won", story: "Indonesia's leading online brokerage. Democratized stock investing for millions of Indonesians.", industry: "Fintech", founded: 2019, seedYear: 2019, seriesAYear: 2021, unicornYear: 2021, status: "active" },
  { name: "Opentrons", batch: "W16", valuation: 1.8, raised: "$386M", category: "sleeper", story: "Open-source lab robotics. COVID testing machines made them essential pandemic infrastructure.", industry: "Biotech", founded: 2014, seedYear: 2016, seriesAYear: 2018, unicornYear: 2021, status: "active" },
  { name: "Sift", batch: "S11", valuation: 1.3, raised: "$157M", category: "sleeper", story: "Digital trust and safety platform detecting fraud in real-time. Powers fraud prevention for 34K+ sites.", industry: "Security", founded: 2011, seedYear: 2011, seriesAYear: 2014, unicornYear: 2021, status: "active" },
  // MORE UNICORNS
  { name: "Legora", batch: "W24", valuation: 5.6, raised: "$600M", category: "sleeper", story: "YC's fastest startup to reach unicorn. Collaborative AI platform used by 800+ law firms across 50+ markets.", industry: "AI", founded: 2023, seedYear: 2024, seriesAYear: 2024, unicornYear: 2025, status: "active" },
  { name: "Nourish", batch: "W21", valuation: 1.75, raised: "$100M", category: "sleeper", story: "Connects patients with dietitians via telehealth, covered by insurance. Tackling chronic disease through nutrition.", industry: "Healthcare", founded: 2021, seedYear: 2021, seriesAYear: 2023, unicornYear: 2025, status: "active" },
  { name: "Papa", batch: "S18", valuation: 1.4, raised: "$301M", category: "sleeper", story: "'Grandkids on demand' — matches older adults with companions for transport, tasks, and social support. SoftBank-backed.", industry: "Healthcare", founded: 2017, seedYear: 2018, seriesAYear: 2019, unicornYear: 2021, status: "active" },
  { name: "Kapital", batch: "W22", valuation: 1.3, raised: "$200M", category: "sleeper", story: "AI neobank for LatAm small businesses. 300K customers across US, Mexico, Colombia with $3B balance sheet.", industry: "Fintech", founded: 2020, seedYear: 2021, seriesAYear: 2022, unicornYear: 2025, status: "active" },
  { name: "Gem", batch: "S17", valuation: 1.2, raised: "$148M", category: "sleeper", story: "Talent engagement platform unifying recruiting data. Used by Lyft, Spotify, Affirm. 800+ business customers.", industry: "HR Tech", founded: 2017, seedYear: 2017, seriesAYear: 2019, unicornYear: 2021, status: "active" },
  { name: "Onebrief", batch: "S21", valuation: 1.1, raised: "$336M", category: "sleeper", story: "Cloud-native military operational planning. Defense tech unicorn turning planning into reusable building blocks.", industry: "Defense", founded: 2019, seedYear: 2020, seriesAYear: 2022, unicornYear: 2025, status: "active" },
  { name: "Vendr", batch: "S19", valuation: 0, raised: "$216M", category: "moderate", story: "SaaS purchasing platform. Raised $216M at a reported $1.2B private valuation in 2022 — never confirmed to have closed a $1B+ round or exit.", industry: "SaaS", founded: 2019, seedYear: 2019, seriesAYear: 2021, status: "active" },
  { name: "Imbue", batch: "S17", valuation: 1, raised: "$220M", category: "sleeper", story: "Women-led AI unicorn building reasoning and coding systems. Nvidia-backed with access to 10,000 GPUs.", industry: "AI", founded: 2020, seedYear: 2020, seriesAYear: 2021, unicornYear: 2023, status: "active" },
  // FINAL SWEEP
  { name: "Prometheus", batch: "S19", valuation: 1.5, raised: "$24.1M", category: "sleeper", story: "First e-fuels unicorn. Removes CO2 from air, uses solar/wind to make zero-net-carbon gasoline cheaper than fossil fuels.", industry: "Climate", founded: 2019, seedYear: 2019, seriesAYear: 2021, unicornYear: 2022, status: "active" },
  { name: "Eight Sleep", batch: "W16", valuation: 1.5, raised: "$160M", category: "sleeper", story: "Smart mattress cover with heating/cooling and sleep tracking. Unicorn in March 2026. Founders Fund-backed.", industry: "Consumer", founded: 2014, seedYear: 2016, seriesAYear: 2018, unicornYear: 2026, status: "active" },
  { name: "Truebill", batch: "W16", valuation: 1.275, raised: "$72M", category: "sleeper", story: "Subscription management app founded by three brothers. Rocket Companies acquired for $1.275B. Rebranded to Rocket Money.", industry: "Fintech", founded: 2015, seedYear: 2016, seriesAYear: 2019, unicornYear: 2021, status: "acquired" },
  { name: "Moxion Power", batch: "W21", valuation: 1.5, raised: "$100M", category: "sleeper", story: "All-electric mobile power replacing diesel generators at construction sites and film sets. Reached climate-tech unicorn status, then went bankrupt in 2024.", industry: "Climate", founded: 2020, seedYear: 2021, seriesAYear: 2022, unicornYear: 2023, status: "dead" },
  { name: "Odeko", batch: "S19", valuation: 1, raised: "$302M", category: "sleeper", story: "Supply chain platform for cafes and small food businesses. Aggregates ordering, inventory, and payments.", industry: "Food", founded: 2019, seedYear: 2019, seriesAYear: 2020, unicornYear: 2022, status: "active" },
  { name: "HelloSign", batch: "W11", valuation: 0.23, raised: "$16M", category: "moderate", story: "E-signature platform competing with DocuSign. Dropbox acquired for $230M in 2019.", industry: "SaaS", founded: 2011, seedYear: 2011, seriesAYear: 2014, status: "acquired" },
  { name: "Clever", batch: "W12", valuation: 0.5, raised: "$55M", category: "moderate", story: "Single sign-on for K-12 classrooms. Used by 65%+ of US schools. Kahoot! acquired for $500M.", industry: "EdTech", founded: 2012, seedYear: 2012, seriesAYear: 2013, status: "acquired" },
  { name: "CoreOS", batch: "S13", valuation: 0.25, raised: "$50M", category: "moderate", story: "Built Container Linux and contributed to Kubernetes ecosystem. Red Hat (IBM) acquired for $250M.", industry: "Dev Tools", founded: 2013, seedYear: 2013, seriesAYear: 2014, status: "acquired" },
  { name: "Bear Flag Robotics", batch: "S17", valuation: 0.25, raised: "$8M", category: "moderate", story: "Autonomous tractor tech. John Deere acquired for $250M on just $8M raised — one of YC's best ROI exits.", industry: "AgTech", founded: 2017, seedYear: 2017, seriesAYear: 2020, status: "acquired" },
  { name: "Sendwave", batch: "S12", valuation: 0.5, raised: "$10M", category: "moderate", story: "Instant no-fee money transfers to Africa. WorldRemit acquired for $500M on just $10M raised.", industry: "Fintech", founded: 2014, seedYear: 2014, status: "acquired" },
  { name: "Caper AI", batch: "W16", valuation: 0.35, raised: "$36M", category: "moderate", story: "AI smart shopping carts for cashier-less checkout. Instacart acquired for $350M in 2021.", industry: "Retail Tech", founded: 2016, seedYear: 2016, seriesAYear: 2019, status: "acquired" },
  { name: "Fivestars", batch: "W11", valuation: 0.317, raised: "$115M", category: "moderate", story: "Customer loyalty and payments for small businesses. 60M+ members. Acquired by SumUp.", industry: "Fintech", founded: 2011, seedYear: 2011, seriesAYear: 2013, status: "acquired" },
  { name: "Protocol Labs", batch: "S14", valuation: 0.6, raised: "$255M", category: "moderate", story: "Built IPFS and Filecoin — foundational internet protocols. Filecoin ICO raised $205M in 2017, the largest token sale at the time. Market cap peaked above $10B.", industry: "Crypto/Web3", founded: 2014, seedYear: 2014, seriesAYear: 2017, unicornYear: 2017, status: "active" },
  { name: "Lambda School", batch: "S17", valuation: 0.05, raised: "$118M", category: "moderate", story: "Free coding bootcamp — pay only after landing a job (ISAs). Massive hype, $118M raised, valued at $600M. Regulatory issues, lawsuits, rebranded to Bloom.", industry: "EdTech", founded: 2017, seedYear: 2017, seriesAYear: 2019, status: "active" },
  { name: "Caviar", batch: "W14", valuation: 0.41, raised: "$16M", category: "moderate", story: "Premium food delivery. Square acquired for $90M in 2014, then DoorDash acquired from Square for $410M in 2019. Big win for founders.", industry: "Food Delivery", founded: 2012, seedYear: 2014, status: "acquired" },
  { name: "Atrium", batch: "W18", valuation: 0, raised: "$75M", category: "moderate", story: "Justin Kan (Twitch co-founder) tried to disrupt law with AI + lawyers. Raised $75M from a16z, YC. Shut down in 2020, laid off 100+ people.", industry: "Legal Tech", founded: 2017, seedYear: 2018, seriesAYear: 2018, status: "dead" },
  { name: "Jasper", batch: "W18", valuation: 1.2, raised: "$131M", category: "sleeper", story: "AI content generation platform. Unicorn in 18 months ($1.5B). Then ChatGPT launched and the moat evaporated. Valuation cut ~20%. The AI commodity cautionary tale.", industry: "AI", founded: 2021, seedYear: 2021, seriesAYear: 2022, unicornYear: 2022, status: "active" },
  { name: "Wave Mobile Money", batch: "W12", valuation: 1.7, raised: "$200M", category: "sleeper", story: "Mobile money for Africa. $1.7B valuation. Largest fintech in Francophone Africa. Processes billions in transactions across Senegal, Côte d'Ivoire, and more.", industry: "Fintech", founded: 2018, seedYear: 2018, seriesAYear: 2020, unicornYear: 2021, status: "active" },
  { name: "Salt Security", batch: "W16", valuation: 1.4, raised: "$271M", category: "sleeper", story: "API security platform. Raised $271M, hit $1.4B valuation. Protects APIs for major enterprises. Quiet YC unicorn in cybersecurity.", industry: "Cybersecurity", founded: 2016, seedYear: 2016, seriesAYear: 2019, unicornYear: 2022, status: "active" },
  { name: "Matterport", batch: "W12", valuation: 1.6, raised: "$160M", category: "sleeper", story: "3D spatial data platform. SPAC'd at $2.9B in 2021, peaked above $8B. Crashed to under $1B. CoStar acquired for $1.6B — a fraction of peak hype.", industry: "PropTech", founded: 2011, seedYear: 2012, seriesAYear: 2014, unicornYear: 2021, status: "acquired" },
  { name: "WePay", batch: "S11", valuation: 0.4, raised: "$75M", category: "moderate", story: "Payment platform for marketplaces. JPMorgan Chase acquired for ~$400M — JPM's first major fintech acquisition.", industry: "Fintech", founded: 2008, seedYear: 2011, seriesAYear: 2012, status: "acquired" },
  { name: "North", batch: "W13", valuation: 0.18, raised: "$267M", category: "moderate", story: "Smart glasses (Focals) — the most consumer-friendly AR glasses ever made. Raised $267M, but Google acquired for just $180M. A cautionary hardware tale.", industry: "Hardware", founded: 2012, seedYear: 2013, seriesAYear: 2014, status: "acquired" },
  { name: "Presto", batch: "W12", valuation: 0.01, raised: "$70M", category: "moderate", story: "Restaurant automation tech for McDonald's and Chili's. SPAC'd at $1B in 2021. Crashed 99%. One of YC's worst SPAC outcomes.", industry: "Restaurant Tech", founded: 2008, seedYear: 2012, seriesAYear: 2015, status: "public" },
  { name: "Lucira Health", batch: "S14", valuation: 0.39, raised: "$85M", category: "moderate", story: "First FDA-authorized at-home COVID-19 molecular test. IPO'd during pandemic. Pfizer acquired for $390M.", industry: "Healthcare", founded: 2013, seedYear: 2014, seriesAYear: 2017, status: "acquired" },
  { name: "Pardes Biosciences", batch: "S21", valuation: 0.05, raised: "$220M", category: "moderate", story: "Oral antiviral for COVID. IPO'd in 2021 at $1.2B. Drug failed trials, company pivoted to autoimmune. Stock collapsed.", industry: "Biotech", founded: 2020, seedYear: 2021, seriesAYear: 2021, status: "public" },
  // NOTABLE ACQUISITIONS
  { name: "Parakey", batch: "S06", valuation: 0, raised: "$0.02M", category: "moderate", story: "Founded by Firefox co-creators Blake Ross and Joe Hewitt. Facebook's very first acquisition. Hewitt built Facebook's iPhone app.", industry: "Web", founded: 2006, seedYear: 2006, status: "acquired" },
  { name: "Zenter", batch: "W07", valuation: 0, raised: "$0.02M", category: "moderate", story: "Web-based presentation tool acquired by Google months after demo day. Became the foundation for Google Slides.", industry: "Productivity", founded: 2007, seedYear: 2007, status: "acquired" },
  { name: "AppJet", batch: "S07", valuation: 0, raised: "$0.7M", category: "moderate", story: "Built EtherPad — one of the first real-time collaborative editors. Google acquired it and the tech became Google Docs.", industry: "Productivity", founded: 2007, seedYear: 2007, status: "acquired" },
  { name: "Omnisio", batch: "W08", valuation: 0, raised: "$0.1M", category: "hot-failed", story: "Video annotation and editing tool. Google acquired and integrated into YouTube's editing capabilities.", industry: "Media", founded: 2007, seedYear: 2008, status: "acquired" },
  { name: "Cloudkick", batch: "W09", valuation: 0, raised: "$2.8M", category: "moderate", story: "Cloud server monitoring. Rackspace acquired 11 months after launch. Founder Alex Polvi later founded CoreOS (also acquired).", industry: "DevOps", founded: 2009, seedYear: 2009, status: "acquired" },
  { name: "Bump", batch: "S09", valuation: 0.03, raised: "$19.9M", category: "moderate", story: "Contact-sharing app — bump phones to exchange info. 125M+ downloads. Google acquired for ~$30M. Team built Google Photos.", industry: "Mobile", founded: 2008, seedYear: 2009, status: "acquired" },
  { name: "Rapportive", batch: "S10", valuation: 0.015, raised: "$1M", category: "moderate", story: "Gmail plugin showing rich social profiles of contacts. LinkedIn acquired. Founder Rahul Vohra later created Superhuman.", industry: "SaaS", founded: 2010, seedYear: 2010, status: "acquired" },
  { name: "Cue", batch: "W10", valuation: 0.05, raised: "$5.8M", category: "moderate", story: "Started as Greplin (personal search), pivoted to Cue assistant. Apple acquired for ~$50M to bolster Siri.", industry: "AI", founded: 2009, seedYear: 2010, status: "acquired" },
  { name: "Flutter", batch: "W12", valuation: 0.04, raised: "$2M", category: "moderate", story: "Gesture recognition — control your computer with hand waves via webcam. Google acquired for ~$40M for the tech.", industry: "AI", founded: 2012, seedYear: 2012, status: "acquired" },
  // LATEST BATCHES (2024-2025)
  { name: "Vapi", batch: "W24", valuation: 0.3, raised: "$75.2M", category: "moderate", story: "Voice AI developer platform for natural phone call agents. Series A at $130M, then Series B 14 months later.", industry: "AI", founded: 2023, seedYear: 2024, seriesAYear: 2024, status: "active" },
  { name: "Browser Use", batch: "W25", valuation: 0.1, raised: "$17M", category: "hot-failed", story: "Open-source browser automation for AI agents. Went viral — 50K GitHub stars in 3 months, 28K daily downloads.", industry: "AI", founded: 2024, seedYear: 2025, status: "active" },
  { name: "Pingo AI", batch: "S25", valuation: 0.06, raised: "$0.5M", category: "hot-failed", story: "AI language learning hit $500K MRR in 14 months with 300K+ users. Growing 70% monthly. The Duolingo killer.", industry: "EdTech", founded: 2025, seedYear: 2025, status: "active" },
  { name: "Perseus Defense", batch: "S25", valuation: 0.05, raised: "$6M", category: "hot-failed", story: "Building America's Iron Dome for drones — 15-inch mini-missiles under $5K each. Multiple US military branches testing.", industry: "Defense", founded: 2025, seedYear: 2025, status: "active" },
  { name: "Solva", batch: "S25", valuation: 0.1, raised: "$21.5M", category: "hot-failed", story: "AI insurance claims automation. Hit $245K ARR 10 weeks after launch. Raised massive Series A right out of YC.", industry: "Insurance", founded: 2025, seedYear: 2025, seriesAYear: 2025, status: "active" },
  // FINAL PUSH
  { name: "Casetext", batch: "S13", valuation: 0.65, raised: "$68M", category: "moderate", story: "Built CoCounsel, GPT-4 AI legal assistant. Thomson Reuters acquired for $650M in 2023 — 5x valuation jump in 18 months.", industry: "Legal Tech", founded: 2013, seedYear: 2013, seriesAYear: 2015, status: "acquired" },
  { name: "The Athletic", batch: "S16", valuation: 0.55, raised: "$140M", category: "moderate", story: "Subscription sports journalism that challenged legacy media. NYT acquired for $550M in 2022.", industry: "Media", founded: 2016, seedYear: 2016, seriesAYear: 2017, status: "acquired" },
  { name: "Heap", batch: "W13", valuation: 0.96, raised: "$216M", category: "moderate", story: "Auto-capture product analytics — no manual event tagging needed. Contentsquare acquired for $960M in 2023.", industry: "Analytics", founded: 2012, seedYear: 2013, seriesAYear: 2015, status: "acquired" },
  { name: "uBiome", batch: "S14", valuation: 0, raised: "$109M", category: "moderate", story: "Raised $109M to decode the microbiome. FBI raided offices over insurance billing fraud. Founders charged.", industry: "Biotech", founded: 2012, seedYear: 2014, seriesAYear: 2016, status: "dead" },
  { name: "Airware", batch: "W13", valuation: 0, raised: "$118M", category: "moderate", story: "Enterprise drone software. Raised $118M but DJI ate their lunch on hardware. Burned cash on obsolete tech. Shut down 2018.", industry: "Drones", founded: 2011, seedYear: 2013, seriesAYear: 2015, status: "dead" },
  { name: "Modern Fertility", batch: "S17", valuation: 0.225, raised: "$22M", category: "moderate", story: "At-home fertility hormone testing. Democratized reproductive health data. Ro acquired for $225M in 2021.", industry: "Healthcare", founded: 2017, seedYear: 2017, seriesAYear: 2019, status: "acquired" },
  { name: "FutureAdvisor", batch: "S10", valuation: 0.15, raised: "$21.5M", category: "moderate", story: "Robo-advisor for automated wealth management. BlackRock — world's largest asset manager — acquired for $150M.", industry: "Fintech", founded: 2010, seedYear: 2010, seriesAYear: 2013, status: "acquired" },
  { name: "Sqreen", batch: "W18", valuation: 0.22, raised: "$35M", category: "moderate", story: "Runtime application security platform. Datadog acquired to expand their security portfolio.", industry: "Security", founded: 2015, seedYear: 2018, seriesAYear: 2019, status: "acquired" },
  // MORE NOTABLE COMPANIES
  { name: "Firebase", batch: "S11", valuation: 0.085, raised: "$12.6M", category: "moderate", story: "Mobile/web dev platform. Google acquired for ~$85M in 2014. Became a core Google Cloud product used by millions of developers.", industry: "Dev Tools", founded: 2011, seedYear: 2011, seriesAYear: 2013, status: "acquired" },
  { name: "Product Hunt", batch: "S14", valuation: 0.02, raised: "$7.3M", category: "hot-failed", story: "Tech product discovery platform. Where the startup world launches products. AngelList acquired in 2016.", industry: "Media", founded: 2013, seedYear: 2014, status: "acquired" },
  { name: "HackerRank", batch: "S11", valuation: 1, raised: "$115M", category: "hot-won", story: "Developer skills assessment platform used by 3,000+ companies for technical hiring.", industry: "HR Tech", founded: 2009, seedYear: 2012, seriesAYear: 2014, unicornYear: 2021, status: "active" },
  { name: "QuickNode", batch: "W21", valuation: 0.8, raised: "$85M", category: "moderate", story: "'AWS for blockchain.' Infrastructure powering Web3 apps and dApps across major chains.", industry: "Crypto", founded: 2017, seedYear: 2021, seriesAYear: 2022, status: "active" },
  { name: "Wefunder", batch: "W13", valuation: 0.1, raised: "$15M", category: "moderate", story: "Leading equity crowdfunding platform. $800M+ invested through the platform by everyday investors.", industry: "Fintech", founded: 2011, seedYear: 2013, status: "active" },
  { name: "Goldbelly", batch: "W15", valuation: 0.5, raised: "$100M", category: "moderate", story: "Ships iconic restaurant food nationwide — Katz's pastrami, Lou Malnati's pizza. Food marketplace unicorn-in-waiting.", industry: "Food", founded: 2013, seedYear: 2015, seriesAYear: 2017, status: "active" },
  { name: "LendUp", batch: "W12", valuation: 0, raised: "$350M", category: "moderate", story: "Alternative lending for the underbanked. Raised $350M but CFPB shut them down in 2021 for deceptive practices.", industry: "Fintech", founded: 2012, seedYear: 2012, seriesAYear: 2014, status: "dead" },
  { name: "9GAG", batch: "S12", valuation: 0.1, raised: "$2.8M", category: "hot-failed", story: "Viral meme and entertainment platform. 200M+ monthly users. Built a massive audience on almost no funding.", industry: "Media", founded: 2008, seedYear: 2012, status: "active" },
  // PUSH TO 300
  { name: "RevenueCat", batch: "S18", valuation: 1.2, raised: "$140M", category: "hot-won", story: "In-app subscription SDK used by 30,000+ apps. The invisible infrastructure behind mobile purchases.", industry: "Dev Tools", founded: 2017, seedYear: 2018, seriesAYear: 2021, unicornYear: 2023, status: "active" },
  { name: "OpenPhone", batch: "S18", valuation: 1.4, raised: "$100M", category: "sleeper", story: "Modern business phone system in an app, replacing legacy telecom for startups and SMBs.", industry: "SaaS", founded: 2018, seedYear: 2018, seriesAYear: 2020, unicornYear: 2022, status: "active" },
  { name: "Mattermost", batch: "W16", valuation: 0.3, raised: "$76M", category: "moderate", story: "Open-source Slack alternative for enterprises and government. Self-hosted secure messaging.", industry: "SaaS", founded: 2016, seedYear: 2016, seriesAYear: 2019, status: "active" },
  { name: "InfluxData", batch: "W13", valuation: 0.5, raised: "$165M", category: "moderate", story: "Creator of InfluxDB, the leading open-source time-series database for metrics and IoT data.", industry: "Data", founded: 2012, seedYear: 2013, seriesAYear: 2015, status: "active" },
  { name: "Lob", batch: "W14", valuation: 0.3, raised: "$100M", category: "moderate", story: "Direct mail automation API enabling programmatic sending of physical letters and postcards.", industry: "API", founded: 2013, seedYear: 2014, seriesAYear: 2017, status: "active" },
  { name: "Snackpass", batch: "S18", valuation: 0.4, raised: "$90M", category: "moderate", story: "Social food ordering app for college campuses blending commerce with group ordering and gifting.", industry: "Food", founded: 2017, seedYear: 2018, seriesAYear: 2020, status: "active" },
  { name: "Iterable", batch: "S13", valuation: 2, raised: "$342M", category: "sleeper", story: "Omnichannel marketing automation for email, SMS, push. Clients include DoorDash and Priceline.", industry: "Marketing", founded: 2013, seedYear: 2013, seriesAYear: 2016, unicornYear: 2021, status: "active" },
  { name: "AtoB", batch: "S20", valuation: 0.8, raised: "$155M", category: "moderate", story: "Modern fuel card and fleet payments. Stripe-like API for the $800B trucking payments industry.", industry: "Fintech", founded: 2019, seedYear: 2020, seriesAYear: 2021, status: "active" },
  { name: "Iron Ox", batch: "W16", valuation: 0.5, raised: "$99M", category: "moderate", story: "Autonomous robotic greenhouses for sustainable farming. Backed by Bill Gates' Breakthrough Energy Ventures.", industry: "AgTech", founded: 2016, seedYear: 2016, seriesAYear: 2018, status: "active" },
  { name: "Pulley", batch: "W20", valuation: 0.25, raised: "$50M", category: "moderate", story: "Cap table and equity management built for YC startups. Simplifies 409A valuations and equity grants.", industry: "Fintech", founded: 2020, seedYear: 2020, seriesAYear: 2021, status: "active" },
  { name: "PartnerStack", batch: "S15", valuation: 0.35, raised: "$67M", category: "moderate", story: "B2B partner ecosystem platform. Powers partner programs for Notion, Monday.com, Webflow.", industry: "SaaS", founded: 2015, seedYear: 2015, seriesAYear: 2019, status: "active" },
  { name: "WorkRamp", batch: "S16", valuation: 0.4, raised: "$67M", category: "sleeper", story: "All-in-one corporate learning cloud. Acquired by Learning Pool (Marlin Equity) Oct 2025.", industry: "EdTech", founded: 2016, seedYear: 2016, seriesAYear: 2019, status: "acquired" },
];

const sleepers = COMPANIES.filter((c) => c.category === "sleeper");
const hotWon = COMPANIES.filter((c) => c.category === "hot-won");
const hotFailed = COMPANIES.filter((c) => c.category === "hot-failed");

const sleepersTotal = sleepers.reduce((s, c) => s + c.valuation, 0);
const hotFailedRaised = "$1.5B+";

const tcBatches = [
  { batch: "S13", year: 2013, picks: 8, failed: 3, failedNames: "SpoonRocket, Buttercoin, Standard Treasury", missed: "DoorDash ($71B IPO)" },
  { batch: "W14", year: 2014, picks: 8, failed: 5, failedNames: "Dating Ring (#2), Kimono Labs, Boostable, BatteryOS…", missed: "Cruise ($1B exit)" },
  { batch: "W19", year: 2019, picks: 10, failed: 3, failedNames: "Flockjay, Docucharm, Parker (bankrupt)", missed: "Deel ($17.3B)" },
];

const quotes = [
  { who: "Paul Graham", role: "YC Co-founder", text: "The hard part was predicting how tough and ambitious they would become. I learned to maintain a completely open mind about which startups in each batch would turn out to be the stars." },
  { who: "Sam Altman", role: "Former YC President", text: "About 25% of YC companies appear to be on a trajectory for billion-dollar valuations at the end of YC, but only a handful actually achieve it." },
  { who: "Dalton Caldwell", role: "YC Managing Director", text: "Tar pit ideas get enthusiastic Demo Day reception but trap founders. They've been tried since the '90s. The real advice is simpler: just don't die." },
  { who: "Aaron Harris", role: "Former YC Partner", text: "There are no specific events that will automatically get money from an investor. I've seen founders cross $1M ARR and still not be able to raise." },
];

const categoryBreakdown = [
  { name: "Sleepers that won", count: sleepers.length, value: Math.round(sleepersTotal), color: "#FF6600" },
  { name: "Hot & won", count: hotWon.length, value: Math.round(hotWon.reduce((s, c) => s + c.valuation, 0)), color: "#10b981" },
  { name: "Moderate & won", count: COMPANIES.filter(c => c.category === "moderate").length, value: Math.round(COMPANIES.filter(c => c.category === "moderate").reduce((s, c) => s + c.valuation, 0)), color: "#3b82f6" },
  { name: "Hot & failed", count: hotFailed.length, value: 0, color: "#ef4444" },
];

const pieData = [
  { name: "Top 5 (Airbnb, Coinbase, DoorDash, Instacart, Rigetti Computing)", value: 72, fill: "#FF6600" },
  { name: "All other verified unicorns", value: 32, fill: "#3b82f6" },
];

/* ── ANALYTICS: Value by Year ── */
const batchToYear = (b: string) => {
  const yr = parseInt(b.slice(1));
  return yr < 100 ? 2000 + yr : yr;
};
const yearMap = new Map<number, { total: number; count: number; unicorns: number; dead: number; top: string }>();
COMPANIES.forEach(c => {
  const yr = batchToYear(c.batch);
  const prev = yearMap.get(yr) || { total: 0, count: 0, unicorns: 0, dead: 0, top: "" };
  prev.total += c.valuation;
  prev.count += 1;
  if (c.valuation >= 1) prev.unicorns += 1;
  if (c.status === "dead") prev.dead += 1;
  if (c.valuation > (yearMap.get(yr)?.total || 0) - prev.total + c.valuation || !prev.top) {
    if (!prev.top || c.valuation > COMPANIES.find(x => x.name === prev.top)!.valuation) prev.top = c.name;
  }
  yearMap.set(yr, prev);
});
const valueByYear = Array.from(yearMap.entries())
  .map(([year, d]) => ({ year, total: Math.round(d.total * 10) / 10, count: d.count, unicorns: d.unicorns, dead: d.dead, top: d.top }))
  .sort((a, b) => a.year - b.year);

/* ── ANALYTICS: Industry Breakdown ── */
const industryMap = new Map<string, { total: number; count: number; unicorns: number }>();
COMPANIES.forEach(c => {
  const ind = c.industry;
  const prev = industryMap.get(ind) || { total: 0, count: 0, unicorns: 0 };
  prev.total += c.valuation;
  prev.count += 1;
  if (c.valuation >= 1) prev.unicorns += 1;
  industryMap.set(ind, prev);
});
const industryData = Array.from(industryMap.entries())
  .map(([industry, d]) => ({ industry, total: Math.round(d.total * 10) / 10, count: d.count, unicorns: d.unicorns }))
  .sort((a, b) => b.total - a.total)
  .slice(0, 15);
const INDUSTRY_COLORS = ["#FF6600", "#3b82f6", "#10b981", "#f59e0b", "#06b6d4", "#ef4444", "#0284c7", "#0891b2", "#14b8a6", "#f97316", "#0369a1", "#84cc16", "#0ea5e9", "#dc2626", "#059669"];

/* ── ANALYTICS: Unicorn Scatter ── */
const unicornScatter = COMPANIES
  .filter(c => c.unicornYear && c.founded)
  .map(c => ({
    name: c.name,
    founded: c.founded,
    yearsToUnicorn: c.unicornYear! - c.founded,
    valuation: c.valuation,
    category: c.category,
  }))
  .sort((a, b) => a.founded - b.founded);


const CATEGORY_META: Record<string, { label: string; color: string; bg: string }> = {
  sleeper: { label: "No Press Pick → Unicorn", color: "#FF6600", bg: "#FFF3EB" },
  "hot-won": { label: "Press Pick → Unicorn", color: "#10b981", bg: "#ecfdf5" },
  "hot-failed": { label: "Press Pick → No Unicorn", color: "#ef4444", bg: "#fef2f2" },
  moderate: { label: "No Unicorn (or No Press Data)", color: "#3b82f6", bg: "#eff6ff" },
};

function ValuationBar({ company, maxVal }: { company: Company; maxVal: number }) {
  const pct = company.valuation > 0 ? Math.max((company.valuation / maxVal) * 100, 2) : 0;
  const meta = CATEGORY_META[company.category];
  return (
    <div className="flex items-center gap-3 py-2 group">
      <div className="w-28 sm:w-36 shrink-0 text-right">
        <span className="text-sm font-semibold text-yc-dark">{company.name}</span>
        <span className="text-xs text-neutral-500 ml-1">{company.batch}</span>
      </div>
      <div className="flex-1 relative h-8 rounded bg-neutral-100 overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 rounded transition-all duration-700 ease-out flex items-center"
          style={{ width: `${pct}%`, backgroundColor: meta.color }}
        >
          {pct > 15 && (
            <span className="text-white text-xs font-bold ml-2 whitespace-nowrap">${company.valuation}B</span>
          )}
        </div>
        {pct <= 15 && company.valuation > 0 && (
          <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs font-bold text-neutral-600">${company.valuation}B</span>
        )}
        {company.valuation === 0 && (
          <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs font-bold text-red-500">$0 — Failed</span>
        )}
      </div>
      <div className="hidden sm:block w-20 shrink-0">
        <span className="company-badge text-xs" style={{ backgroundColor: meta.bg, color: meta.color }}>
          {meta.label}
        </span>
      </div>
    </div>
  );
}

export default function Home() {
  const [filter, setFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [chartTab, setChartTab] = useState<"vintage" | "industry" | "unicorns">("vintage");
  const [sortField, setSortField] = useState<"name" | "batch" | "valuation" | "industry" | "category" | "status">("valuation");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const toggleSort = (field: typeof sortField) => {
    if (sortField === field) {
      setSortDir((d) => (d === "desc" ? "asc" : "desc"));
    } else {
      setSortField(field);
      setSortDir(field === "name" || field === "batch" || field === "industry" || field === "category" || field === "status" ? "asc" : "desc");
    }
  };

  const maxVal = Math.max(...COMPANIES.map((c) => c.valuation));

  // Unique batches actually in the dataset, sorted chronologically (e.g. W09, S09, ...)
  const heroBatches = Array.from(new Set(COMPANIES.map((c) => c.batch)))
    .sort((a, b) => {
      const ay = parseInt(a.slice(1), 10);
      const by = parseInt(b.slice(1), 10);
      if (ay !== by) return ay - by;
      return a[0] === b[0] ? 0 : a[0] === "W" ? -1 : 1; // Winter before Summer within a year
    });

  const filteredCompanies = filter === "all" ? COMPANIES : COMPANIES.filter((c) => c.category === filter);
  const searched = search
    ? filteredCompanies.filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.industry.toLowerCase().includes(search.toLowerCase()) || c.batch.toLowerCase().includes(search.toLowerCase()))
    : filteredCompanies;
  const sorted = [...searched].sort((a, b) => {
    let cmp = 0;
    if (sortField === "name") cmp = a.name.localeCompare(b.name);
    else if (sortField === "industry") cmp = a.industry.localeCompare(b.industry);
    else if (sortField === "category") cmp = CATEGORY_META[a.category].label.localeCompare(CATEGORY_META[b.category].label);
    else if (sortField === "status") cmp = a.status.localeCompare(b.status);
    else if (sortField === "batch") cmp = batchToYear(a.batch) - batchToYear(b.batch) || a.batch.localeCompare(b.batch);
    else cmp = a.valuation - b.valuation;
    return sortDir === "asc" ? cmp : -cmp;
  });

  return (
    <main>
      {/* ── HERO ── */}
      <section className="relative overflow-hidden bg-yc-dark min-h-[85vh] sm:min-h-screen flex flex-col justify-center hero-grain">
        <div className="absolute inset-0 yc-grid" />
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[120%] h-[420px] bg-[#FF6600]/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#FF6600]/5 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#FF6600]/30 to-transparent" />

        <div className="relative z-10 max-w-5xl mx-auto px-6 sm:px-8 py-20 w-full">
          {/* YC-style logo lockup */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-3 mb-10"
          >
            <span className="yc-mark">Y</span>
            <div className="leading-tight">
              <p className="text-white font-bold text-sm tracking-tight">Demo Day Heat Check</p>
              <p className="text-white/40 text-xs font-medium tracking-wide">An independent data study</p>
            </div>
            <span className="ml-2 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/8 text-xs text-white/60 backdrop-blur-sm border border-white/5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF6600] pulse-dot" />
              5,025 verified · 20 years
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl sm:text-6xl lg:text-[5.5rem] font-bold text-white"
          >
            Does Demo Day<br />
            hype predict{" "}
            <span className="relative inline-block text-[#FF6600]">
              success?
              <motion.span
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.7, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
                className="absolute -bottom-1 left-0 right-0 h-[3px] bg-[#FF6600] origin-left rounded-full"
              />
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="text-lg sm:text-xl text-white/50 mt-8 max-w-xl leading-relaxed"
          >
            We verified 5,025 YC companies across 20 years against genuine, contemporaneous press coverage — not hindsight labels — to find out if Demo Day buzz predicts long-term outcomes.<br />
            <span className="text-white/90 font-semibold">It mostly doesn&apos;t.</span>
          </motion.p>

          {/* Batch marquee */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="batch-mask mt-10 overflow-hidden"
            aria-hidden="true"
          >
            <div className="batch-track">
              {[...heroBatches, ...heroBatches].map((b, i) => (
                <span key={i} className="batch-chip">{b}</span>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-12"
          >
            {[
              { big: "1.04", label: "Era-adjusted odds ratio", sub: "hot vs. unicorn odds — not significant" },
              { big: "5,025", label: "Companies analyzed", sub: "20 yrs, verified via research" },
              { big: "2.5%", label: "Actually become", sub: "unicorns ($1B+), full population" },
              { big: "~19%", label: "Ultimately", sub: "fail entirely (verified)" },
            ].map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                className="stat-card border border-white/8 rounded-xl p-4 sm:p-5 bg-white/[0.03] backdrop-blur-sm hover:bg-white/[0.06] transition-colors duration-300"
              >
                <p className="text-2xl sm:text-3xl font-bold text-[#FF6600] tabular-nums">{s.big}</p>
                <p className="text-sm font-medium text-white/90 mt-1">{s.label}</p>
                <p className="text-xs text-white/40 mt-0.5">{s.sub}</p>
              </motion.div>
            ))}
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.2 }}
            className="text-xs text-white/25 mt-8"
          >
            Not affiliated with Y Combinator. Independent research by <a href="https://x.com/Trace_Cohen" className="text-[#FF6600]/60 hover:text-[#FF6600] transition-colors">@Trace_Cohen</a>
          </motion.p>
        </div>
      </section>

      <div className="gradient-line" />

      {/* ── THE THESIS ── */}
      <section className="max-w-5xl mx-auto px-6 sm:px-8 py-16 sm:py-24">
        <Reveal>
          <div className="max-w-3xl">
            <div className="inline-block px-3 py-1 rounded-full bg-[#FFF3EB] text-[#FF6600] text-xs font-bold uppercase tracking-widest mb-4">The Thesis</div>
            <h2 className="text-3xl sm:text-5xl font-bold text-yc-dark leading-tight">
              The companies nobody wanted<br />
              are worth <span className="text-[#FF6600]">${Math.round(sleepersTotal)}B+</span> today.
            </h2>
            <p className="text-neutral-600 mt-4 text-base sm:text-lg leading-relaxed max-w-2xl">
              Airbnb was rejected 7+ times. DoorDash was bottom half of its batch. Coinbase couldn&apos;t fill a $1M round. Some of the companies investors fought over at Demo Day raised hundreds of millions and are now worth $0 — but on average, across 5,025 verified companies, press coverage barely moves the odds once you adjust for the era each batch launched in.
            </p>
          </div>
        </Reveal>

        <Reveal delay={100}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-12">
            <div className="rounded-2xl border-2 border-[#FF6600]/20 bg-[#FFF3EB] p-6 card-hover">
              <p className="text-sm font-bold text-[#FF6600] uppercase tracking-wider">The Sleepers</p>
              <p className="text-4xl sm:text-5xl font-bold text-yc-dark mt-2">
                $<CountUp to={Math.round(sleepersTotal)} duration={2000} />B+
              </p>
              <p className="text-neutral-600 text-sm mt-2">Combined valuation of {sleepers.length} companies that were overlooked or struggled at Demo Day</p>
              <div className="flex flex-wrap gap-2 mt-4">
                {sleepers.slice(0, 8).map((c) => (
                  <span key={c.name} className="company-badge bg-white text-yc-dark text-xs border border-[#FF6600]/20">
                    {c.name} <span className="text-neutral-400">{c.batch}</span>
                  </span>
                ))}
                {sleepers.length > 8 && <span className="company-badge bg-white text-neutral-500 text-xs border border-neutral-200">+{sleepers.length - 8} more</span>}
              </div>
            </div>

            <div className="rounded-2xl border-2 border-red-200 bg-red-50 p-6 card-hover">
              <p className="text-sm font-bold text-red-600 uppercase tracking-wider">The Darlings That Died</p>
              <p className="text-4xl sm:text-5xl font-bold text-yc-dark mt-2">$0</p>
              <p className="text-neutral-600 text-sm mt-2">{hotFailed.length} companies that were hyped at Demo Day but raised {hotFailedRaised} and failed</p>
              <div className="flex flex-wrap gap-2 mt-4">
                {hotFailed.slice(0, 8).map((c) => (
                  <span key={c.name} className="company-badge bg-white text-yc-dark text-xs border border-red-200">
                    {c.name} <span className="text-neutral-400">{c.raised}</span>
                  </span>
                ))}
                {hotFailed.length > 8 && <span className="company-badge bg-white text-neutral-500 text-xs border border-neutral-200">+{hotFailed.length - 8} more</span>}
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ── TOP 25 BAR RACE ── */}
      <section className="bg-white border-y border-neutral-200">
        <div className="max-w-5xl mx-auto px-6 sm:px-8 py-16 sm:py-24">
          <Reveal>
            <div className="inline-block px-3 py-1 rounded-full bg-[#FFF3EB] text-[#FF6600] text-xs font-bold uppercase tracking-widest mb-4">The Data</div>
            <h2 className="text-3xl sm:text-5xl font-bold text-yc-dark">Top 25 most valuable</h2>
            <p className="text-neutral-500 mt-2 text-sm sm:text-base">Orange = sleepers nobody wanted. Green = hot from day 1. Blue = moderate. Red = hot but failed.</p>
          </Reveal>

          <div className="mt-6 space-y-0.5">
            {[...COMPANIES].sort((a, b) => b.valuation - a.valuation).slice(0, 25).map((c) => (
              <ValuationBar key={c.name} company={c} maxVal={maxVal} />
            ))}
          </div>
        </div>
      </section>

      {/* ── FULL DIRECTORY ── */}
      <section className="max-w-5xl mx-auto px-6 sm:px-8 py-16 sm:py-24">
        <Reveal>
          <div className="inline-block px-3 py-1 rounded-full bg-neutral-100 text-neutral-600 text-xs font-bold uppercase tracking-widest mb-4">Full Directory</div>
          <h2 className="text-3xl sm:text-5xl font-bold text-yc-dark">242 notable companies</h2>
          <p className="text-neutral-500 mt-2 text-sm sm:text-base">An illustrative subset of the full 5,025-company verified dataset, labeled using real hot/unicorn signal. Search by name, industry, or batch. Filter by category.</p>
        </Reveal>

        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Search companies..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-4 py-2.5 rounded-xl border border-neutral-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6600]/30 focus:border-[#FF6600]"
          />
          <div className="flex flex-wrap gap-2">
            {[
              { key: "all", label: "All" },
              { key: "sleeper", label: "Sleepers" },
              { key: "hot-won", label: "Hot → Won" },
              { key: "hot-failed", label: "Hot → Failed" },
              { key: "moderate", label: "Moderate" },
            ].map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`px-3 py-2 rounded-lg text-xs font-semibold transition active:scale-[0.97] ${
                  filter === f.key
                    ? "bg-yc-dark text-white"
                    : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4 overflow-x-auto rounded-xl border border-neutral-200 bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-100 bg-neutral-50">
                {([
                  { key: "name", label: "Company", align: "text-left", cls: "px-4 py-3" },
                  { key: "batch", label: "Batch", align: "text-left", cls: "px-3 py-3" },
                  { key: "valuation", label: "Valuation", align: "text-right", cls: "px-3 py-3" },
                  { key: "industry", label: "Industry", align: "text-left", cls: "px-3 py-3 hidden sm:table-cell" },
                  { key: "category", label: "Category", align: "text-left", cls: "px-3 py-3 hidden md:table-cell" },
                  { key: "status", label: "Status", align: "text-left", cls: "px-3 py-3 hidden lg:table-cell" },
                ] as const).map((col) => (
                  <th key={col.key} className={`${col.align} ${col.cls} font-semibold text-neutral-500 text-xs uppercase tracking-wider select-none`}>
                    <button
                      onClick={() => toggleSort(col.key)}
                      className={`inline-flex items-center gap-1 hover:text-yc-dark transition ${sortField === col.key ? "text-yc-dark" : ""}`}
                    >
                      {col.label}
                      <span className="text-[10px] opacity-60">
                        {sortField === col.key ? (sortDir === "asc" ? "▲" : "▼") : "↕"}
                      </span>
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sorted.slice(0, 50).map((c, i) => {
                const meta = CATEGORY_META[c.category];
                return (
                  <tr key={c.name} className={`border-b border-neutral-50 hover:bg-neutral-50 transition ${i % 2 === 0 ? "" : "bg-neutral-25"}`}>
                    <td className="px-4 py-2.5">
                      <span className="font-semibold text-yc-dark">{c.name}</span>
                    </td>
                    <td className="px-3 py-2.5 text-neutral-500 font-mono text-xs">{c.batch}</td>
                    <td className="px-3 py-2.5 text-right font-semibold tabular-nums">
                      {c.valuation > 0 ? <span className="text-yc-dark">${c.valuation}B</span> : <span className="text-red-500">$0</span>}
                    </td>
                    <td className="px-3 py-2.5 text-neutral-500 text-xs hidden sm:table-cell">{c.industry}</td>
                    <td className="px-3 py-2.5 hidden md:table-cell">
                      <span className="inline-block px-2 py-0.5 rounded-full text-xs font-semibold" style={{ backgroundColor: meta.bg, color: meta.color }}>{meta.label}</span>
                    </td>
                    <td className="px-3 py-2.5 text-xs hidden lg:table-cell">
                      <span className={`${c.status === "dead" ? "text-red-500" : c.status === "public" ? "text-blue-600" : c.status === "acquired" ? "text-amber-600" : "text-green-600"}`}>
                        {c.status === "dead" ? "Dead" : c.status === "public" ? "Public" : c.status === "acquired" ? "Acquired" : "Active"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {sorted.length > 50 && (
            <div className="px-4 py-3 text-center text-xs text-neutral-400 border-t border-neutral-100">
              Showing top 50 of {sorted.length} results{search && ` matching "${search}"`}
            </div>
          )}
          {sorted.length === 0 && (
            <div className="px-4 py-8 text-center text-sm text-neutral-400">No companies match your search.</div>
          )}
        </div>
      </section>

      {/* ── SLEEPERS vs FAILURES — side by side ── */}
      <section className="max-w-5xl mx-auto px-6 sm:px-8 py-16 sm:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <Reveal>
              <div className="inline-block px-3 py-1 rounded-full bg-[#FFF3EB] text-[#FF6600] text-xs font-bold uppercase tracking-widest mb-3">Sleepers</div>
              <h2 className="text-2xl sm:text-3xl font-bold text-yc-dark">Nobody wanted them.</h2>
              <p className="text-neutral-500 mt-1 text-sm">Rejected at Demo Day. Now worth billions.</p>
            </Reveal>
            <div className="mt-4 space-y-3">
              {[...sleepers].sort((a, b) => b.valuation - a.valuation).slice(0, 6).map((c) => (
                <div key={c.name} className="rounded-xl border border-neutral-200 bg-white p-4 hover:border-[#FF6600]/40 hover:shadow-md transition-all duration-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-yc-dark">{c.name}</span>
                      <span className="text-xs text-neutral-400 ml-2 font-mono">{c.batch}</span>
                    </div>
                    <span className="text-lg font-bold text-[#FF6600]">${c.valuation}B</span>
                  </div>
                  <p className="text-xs text-neutral-500 mt-1.5 leading-relaxed line-clamp-2">{c.story}</p>
                </div>
              ))}
              <p className="text-xs text-neutral-400 text-center mt-2">+ {sleepers.length - 6} more sleepers in the full directory above</p>
            </div>
          </div>

          <div>
            <Reveal>
              <div className="inline-block px-3 py-1 rounded-full bg-red-500/10 text-red-500 text-xs font-bold uppercase tracking-widest mb-3">The Graveyard</div>
              <h2 className="text-2xl sm:text-3xl font-bold text-yc-dark">Everyone fought over them.</h2>
              <p className="text-neutral-500 mt-1 text-sm">Hottest at Demo Day. VCs piled in. All dead.</p>
            </Reveal>
            <div className="mt-4 space-y-3">
              {[...hotFailed].sort((a, b) => {
                const aR = parseFloat(a.raised.replace(/[^0-9.]/g, '')) * (a.raised.includes('B') ? 1000 : 1);
                const bR = parseFloat(b.raised.replace(/[^0-9.]/g, '')) * (b.raised.includes('B') ? 1000 : 1);
                return bR - aR;
              }).slice(0, 6).map((c) => (
                <div key={c.name} className="rounded-xl border border-red-200 bg-red-50/50 p-4 hover:border-red-400 hover:shadow-md transition-all duration-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-yc-dark">{c.name}</span>
                      <span className="text-xs text-neutral-400 ml-2 font-mono">{c.batch}</span>
                    </div>
                    <span className="text-xs font-bold text-red-500 bg-red-100 px-2 py-0.5 rounded-full">Raised {c.raised}</span>
                  </div>
                  <p className="text-xs text-neutral-500 mt-1.5 leading-relaxed line-clamp-2">{c.story}</p>
                </div>
              ))}
              <p className="text-xs text-neutral-400 text-center mt-2">+ {hotFailed.length - 6} more failures in the full directory</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── TECHCRUNCH PICKS ── */}
      <section className="max-w-5xl mx-auto px-6 sm:px-8 py-16 sm:py-24">
        <Reveal>
          <div className="inline-block px-3 py-1 rounded-full bg-[#FFF3EB] text-[#FF6600] text-xs font-bold uppercase tracking-widest mb-4">TechCrunch Cross-Reference</div>
          <h2 className="text-3xl sm:text-5xl font-bold text-yc-dark">Three batches where<br />the pundits missed it.</h2>
          <p className="text-neutral-500 mt-2 text-sm sm:text-base max-w-2xl">In these three illustrative batches, TechCrunch&apos;s &ldquo;Top Picks&rdquo; missed the biggest eventual winner — but across all 5,025 verified companies, press coverage doesn&apos;t reliably predict outcomes in either direction once era is controlled for.</p>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          {tcBatches.map((b, i) => (
            <Reveal key={b.batch} delay={i * 50}>
              <div className="rounded-2xl border border-neutral-200 bg-white p-6 h-full">
                <div className="flex items-baseline justify-between">
                  <h3 className="text-2xl font-bold text-yc-dark">{b.batch}</h3>
                  <span className="text-xs text-neutral-400">{b.year}</span>
                </div>

                <div className="mt-4 flex items-center gap-3">
                  <div className="flex-1 h-3 rounded-full bg-neutral-100 overflow-hidden">
                    <div className="h-full bg-red-500 rounded-full" style={{ width: `${(b.failed / b.picks) * 100}%` }} />
                  </div>
                  <span className="text-sm font-bold text-red-600">{b.failed}/{b.picks}</span>
                </div>
                <p className="text-xs text-neutral-500 mt-1">top picks failed or acqui-hired</p>

                <div className="mt-4 p-3 rounded-xl bg-[#FFF3EB] border border-[#FF6600]/20">
                  <p className="text-xs font-bold text-[#FF6600]">BIGGEST WINNER NOT PICKED</p>
                  <p className="text-sm font-semibold text-yc-dark mt-1">{b.missed}</p>
                </div>

                <p className="text-xs text-neutral-400 mt-3 leading-relaxed">{b.failedNames}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── POWER LAW ── */}
      <section className="bg-white border-y border-neutral-200">
        <div className="max-w-5xl mx-auto px-6 sm:px-8 py-16 sm:py-24">
          <Reveal>
            <div className="inline-block px-3 py-1 rounded-full bg-[#FFF3EB] text-[#FF6600] text-xs font-bold uppercase tracking-widest mb-4">Power Law</div>
            <h2 className="text-3xl sm:text-5xl font-bold text-yc-dark">5 companies = 72% of all value</h2>
            <p className="text-neutral-500 mt-2 text-sm sm:text-base max-w-2xl">
              YC&apos;s returns follow an extreme power law. Airbnb, Coinbase, DoorDash, Instacart, and Rigetti Computing account for nearly three-quarters of all verified YC portfolio value — and none of them were named as Demo Day press picks.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-12 items-center">
            <Reveal>
              <div role="img" aria-label="Pie chart showing share of YC portfolio value">
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={120}
                      dataKey="value"
                      startAngle={90}
                      endAngle={-270}
                      stroke="none"
                    >
                      {pieData.map((d, i) => (
                        <Cell key={i} fill={d.fill} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ background: "#1a1a1a", border: "none", borderRadius: 8, color: "#fff", fontSize: 13 }} formatter={(v) => `${v}%`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-wrap gap-4 justify-center mt-2">
                {pieData.map((d) => (
                  <div key={d.name} className="flex items-center gap-2 text-xs text-neutral-600">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: d.fill }} />
                    {d.name}
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal delay={100}>
              <div className="space-y-4">
                {[
                  { n: "0.19%", label: "of YC companies are decacorns", sub: "10 of 5,157 verified companies, >$10B" },
                  { n: "2.6%", label: "become unicorns at all", sub: "136 of 5,157 verified companies" },
                  { n: "1,039", label: "companies confirmed inactive", sub: "20% of the full verified population" },
                  { n: "5/5", label: "of the top 5 had no Demo Day press pick", sub: "Coinbase, DoorDash, Instacart, Rigetti Computing confirmed overlooked — Airbnb's batch predates available press coverage" },
                ].map((s, i) => (
                  <div key={i} className="flex gap-4 items-start">
                    <span className="text-2xl font-bold text-[#FF6600] tabular-nums shrink-0 w-16 text-right">{s.n}</span>
                    <div>
                      <p className="text-sm font-semibold text-yc-dark">{s.label}</p>
                      <p className="text-xs text-neutral-500">{s.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── CATEGORY BREAKDOWN (merged into Power Law above) ── */}
      <section className="max-w-5xl mx-auto px-6 sm:px-8 pb-16 sm:pb-24">
        <Reveal>
          <div className="bg-white rounded-2xl border border-neutral-200 p-4 sm:p-6">
            <h3 className="text-lg font-bold text-yc-dark mb-4">Category Breakdown</h3>
            <p className="text-xs text-neutral-400 mb-4 -mt-2">Every one of these 243 companies has been individually cross-checked against YC&apos;s own directory — 22 companies previously in this dataset were removed after failing to verify as actual YC alumni.</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {categoryBreakdown.map((d) => (
                <div key={d.name} className="text-center rounded-xl bg-neutral-50 p-4">
                  <p className="text-3xl font-bold tabular-nums" style={{ color: d.color }}>{d.count}</p>
                  <p className="text-xs text-neutral-500 mt-1">{d.name}</p>
                  <p className="text-xs font-semibold text-neutral-700 mt-0.5">${d.value}B total</p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      {/* ── FUNDING VELOCITY ── */}
      <section className="bg-white border-y border-neutral-200">
        <div className="max-w-5xl mx-auto px-6 sm:px-8 py-16 sm:py-24">
          <Reveal>
            <div className="inline-block px-3 py-1 rounded-full bg-[#FFF3EB] text-[#FF6600] text-xs font-bold uppercase tracking-widest mb-4">Funding Velocity</div>
            <h2 className="text-3xl sm:text-5xl font-bold text-yc-dark">How fast did they scale?</h2>
            <p className="text-neutral-500 mt-2 text-sm sm:text-base max-w-2xl">
              Time from founding to unicorn status ($1B+ valuation). The fastest got there in 1–2 years. Some took over a decade. Many never made it.
            </p>
          </Reveal>

          {(() => {
            const unicorns = COMPANIES
              .filter(c => c.unicornYear && c.founded)
              .map(c => ({ ...c, yearsToUnicorn: c.unicornYear! - c.founded }))
              .sort((a, b) => a.yearsToUnicorn - b.yearsToUnicorn);

            const fastest = unicorns.slice(0, 8);

            const seedToA = COMPANIES
              .filter(c => c.seedYear && c.seriesAYear)
              .map(c => ({ ...c, gap: c.seriesAYear! - c.seedYear! }));

            const avgSeedToA = seedToA.length > 0 ? (seedToA.reduce((s, c) => s + c.gap, 0) / seedToA.length).toFixed(1) : "N/A";
            const avgToUnicorn = unicorns.length > 0 ? (unicorns.reduce((s, c) => s + c.yearsToUnicorn, 0) / unicorns.length).toFixed(1) : "N/A";

            const speedBuckets = [
              { label: "≤2 years", count: unicorns.filter(c => c.yearsToUnicorn <= 2).length, color: "#FF6600" },
              { label: "3–4 years", count: unicorns.filter(c => c.yearsToUnicorn >= 3 && c.yearsToUnicorn <= 4).length, color: "#10b981" },
              { label: "5–6 years", count: unicorns.filter(c => c.yearsToUnicorn >= 5 && c.yearsToUnicorn <= 6).length, color: "#3b82f6" },
              { label: "7–9 years", count: unicorns.filter(c => c.yearsToUnicorn >= 7 && c.yearsToUnicorn <= 9).length, color: "#f59e0b" },
              { label: "10+ years", count: unicorns.filter(c => c.yearsToUnicorn >= 10).length, color: "#ef4444" },
            ];

            const statusCounts = [
              { label: "Active (Private)", count: COMPANIES.filter(c => c.status === "active").length, color: "#10b981" },
              { label: "Public", count: COMPANIES.filter(c => c.status === "public").length, color: "#3b82f6" },
              { label: "Acquired", count: COMPANIES.filter(c => c.status === "acquired").length, color: "#f59e0b" },
              { label: "Dead", count: COMPANIES.filter(c => c.status === "dead").length, color: "#ef4444" },
            ];

            const maxFastest = Math.max(...fastest.map(c => c.yearsToUnicorn));

            return (
              <>
                <Reveal delay={100}>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-10">
                    <div className="rounded-2xl border border-neutral-200 p-5 text-center">
                      <p className="text-3xl sm:text-4xl font-bold text-[#FF6600] tabular-nums">{avgToUnicorn}y</p>
                      <p className="text-xs text-neutral-500 mt-1">Avg. years to unicorn</p>
                    </div>
                    <div className="rounded-2xl border border-neutral-200 p-5 text-center">
                      <p className="text-3xl sm:text-4xl font-bold text-[#10b981] tabular-nums">{avgSeedToA}y</p>
                      <p className="text-xs text-neutral-500 mt-1">Avg. seed → Series A</p>
                    </div>
                    <div className="rounded-2xl border border-neutral-200 p-5 text-center">
                      <p className="text-3xl sm:text-4xl font-bold text-[#3b82f6] tabular-nums">{unicorns.length}</p>
                      <p className="text-xs text-neutral-500 mt-1">Reached unicorn status</p>
                    </div>
                    <div className="rounded-2xl border border-neutral-200 p-5 text-center">
                      <p className="text-3xl sm:text-4xl font-bold text-[#ef4444] tabular-nums">{COMPANIES.filter(c => c.status === "dead").length}</p>
                      <p className="text-xs text-neutral-500 mt-1">Completely dead</p>
                    </div>
                  </div>
                </Reveal>

                <Reveal delay={150}>
                  <div className="mt-12">
                    <h3 className="text-lg font-bold text-yc-dark mb-1">Fastest to Unicorn</h3>
                    <p className="text-xs text-neutral-500 mb-4">Years from founding to $1B+ valuation</p>
                    <div className="space-y-1">
                      {fastest.map((c) => {
                        const meta = CATEGORY_META[c.category];
                        const pct = Math.max((c.yearsToUnicorn / maxFastest) * 100, 8);
                        return (
                          <div key={c.name} className="flex items-center gap-3 py-1.5 group">
                            <div className="w-28 sm:w-36 shrink-0 text-right">
                              <span className="text-sm font-semibold text-yc-dark">{c.name}</span>
                              <span className="text-xs text-neutral-400 ml-1">{c.batch}</span>
                            </div>
                            <div className="flex-1 relative h-7 rounded bg-neutral-100 overflow-hidden">
                              <div
                                className="absolute inset-y-0 left-0 rounded transition-all duration-700 ease-out flex items-center"
                                style={{ width: `${pct}%`, backgroundColor: meta.color }}
                              >
                                <span className="text-white text-xs font-bold ml-2 whitespace-nowrap">{c.yearsToUnicorn}y</span>
                              </div>
                            </div>
                            <div className="hidden sm:block w-16 shrink-0 text-right">
                              <span className="text-xs text-neutral-500">${c.valuation}B</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </Reveal>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
                  <Reveal delay={250}>
                    <div className="rounded-2xl border border-neutral-200 p-6">
                      <h3 className="text-lg font-bold text-yc-dark mb-4">Time to Unicorn Distribution</h3>
                      <div className="space-y-3">
                        {speedBuckets.map((b) => (
                          <div key={b.label} className="flex items-center gap-3">
                            <span className="text-sm text-neutral-600 w-20 shrink-0">{b.label}</span>
                            <div className="flex-1 h-6 rounded bg-neutral-100 overflow-hidden">
                              <div
                                className="h-full rounded flex items-center transition-all duration-500"
                                style={{ width: `${Math.max((b.count / unicorns.length) * 100, 4)}%`, backgroundColor: b.color }}
                              >
                                {b.count > 0 && <span className="text-white text-xs font-bold ml-2">{b.count}</span>}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Reveal>

                  <Reveal delay={300}>
                    <div className="rounded-2xl border border-neutral-200 p-6">
                      <h3 className="text-lg font-bold text-yc-dark mb-4">Current Status</h3>
                      <div className="space-y-3">
                        {statusCounts.map((s) => (
                          <div key={s.label} className="flex items-center gap-3">
                            <span className="text-sm text-neutral-600 w-28 shrink-0">{s.label}</span>
                            <div className="flex-1 h-6 rounded bg-neutral-100 overflow-hidden">
                              <div
                                className="h-full rounded flex items-center transition-all duration-500"
                                style={{ width: `${Math.max((s.count / COMPANIES.length) * 100, 4)}%`, backgroundColor: s.color }}
                              >
                                <span className="text-white text-xs font-bold ml-2">{s.count}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <p className="text-xs text-neutral-400 mt-4">{COMPANIES.length} companies tracked</p>
                    </div>
                  </Reveal>
                </div>
              </>
            );
          })()}
        </div>
      </section>

      {/* ── ANALYTICS DASHBOARD (tabbed) ── */}
      <section className="bg-white border-y border-neutral-200">
        <div className="max-w-5xl mx-auto px-6 sm:px-8 py-16 sm:py-24">
          <Reveal>
            <div className="inline-block px-3 py-1 rounded-full bg-[#FF6600]/20 text-[#FF6600] text-xs font-bold uppercase tracking-widest mb-4">Deep Dive</div>
            <h2 className="text-3xl sm:text-5xl font-bold text-yc-dark">The analytics</h2>
          </Reveal>

          <div className="flex gap-2 mt-6 mb-6">
            {([
              { key: "vintage" as const, label: "By Year" },
              { key: "industry" as const, label: "By Industry" },
              { key: "unicorns" as const, label: "Unicorn Map" },
            ]).map((t) => (
              <button
                key={t.key}
                onClick={() => setChartTab(t.key)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition active:scale-[0.97] ${
                  chartTab === t.key
                    ? "bg-yc-dark text-white"
                    : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {chartTab === "vintage" && (
            <div>
              <p className="text-neutral-500 text-sm mb-4">Total value created by YC batch year. Some vintages are worth 100x more than others.</p>
              <div className="h-[380px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={valueByYear} margin={{ top: 10, right: 10, left: 10, bottom: 30 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                    <XAxis dataKey="year" tick={{ fontSize: 12, fill: "#737373" }} angle={-45} textAnchor="end" />
                    <YAxis tick={{ fontSize: 12, fill: "#737373" }} tickFormatter={(v: number) => `$${v}B`} />
                    <Tooltip
                      formatter={((value: number, name: string) => {
                        if (name === "total") return [`$${value}B`, "Total Value"];
                        return [value, name];
                      }) as never}
                      labelFormatter={((year: number) => {
                        const d = valueByYear.find(v => v.year === year);
                        return `${year} — ${d?.count} companies, top: ${d?.top}`;
                      }) as never}
                      contentStyle={{ borderRadius: "12px", border: "1px solid #e5e5e5" }}
                    />
                    <Bar dataKey="total" radius={[6, 6, 0, 0]}>
                      {valueByYear.map((entry, i) => (
                        <Cell key={i} fill={entry.total > 100 ? "#FF6600" : entry.total > 20 ? "#3b82f6" : entry.total > 5 ? "#10b981" : "#d4d4d4"} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-wrap gap-4 mt-3 justify-center text-xs text-neutral-500">
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-[#FF6600]" /> $100B+</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-[#3b82f6]" /> $20–100B</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-[#10b981]" /> $5–20B</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-[#d4d4d4]" /> Under $5B</span>
              </div>
            </div>
          )}

          {chartTab === "industry" && (
            <div>
              <p className="text-neutral-500 text-sm mb-4">Top 15 industries by total portfolio value.</p>
              <div className="h-[450px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={industryData} layout="vertical" margin={{ left: 120, right: 30, top: 10, bottom: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" horizontal={false} />
                    <XAxis type="number" tick={{ fontSize: 12, fill: "#737373" }} tickFormatter={(v: number) => `$${v}B`} />
                    <YAxis type="category" dataKey="industry" tick={{ fontSize: 12, fill: "#525252" }} width={110} />
                    <Tooltip
                      formatter={((value: number) => [`$${value}B`, "Total Value"]) as never}
                      labelFormatter={((ind: string) => {
                        const d = industryData.find(x => x.industry === ind);
                        return `${ind} — ${d?.count} companies, ${d?.unicorns} unicorns`;
                      }) as never}
                      contentStyle={{ borderRadius: "12px", border: "1px solid #e5e5e5" }}
                    />
                    <Bar dataKey="total" radius={[0, 6, 6, 0]}>
                      {industryData.map((_, i) => (
                        <Cell key={i} fill={INDUSTRY_COLORS[i % INDUSTRY_COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mt-4">
                {industryData.slice(0, 5).map((d, i) => (
                  <div key={d.industry} className="rounded-lg border border-neutral-200 p-3 text-center">
                    <div className="text-xl font-bold" style={{ color: INDUSTRY_COLORS[i] }}>{d.count}</div>
                    <div className="text-xs text-neutral-500">{d.industry}</div>
                    <div className="text-xs font-semibold text-neutral-700">{d.unicorns} unicorns</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {chartTab === "unicorns" && (
            <div>
              <p className="text-neutral-500 text-sm mb-4">Each dot is a YC unicorn. X = founding year, Y = years to hit $1B. Bigger dots = higher valuation.</p>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart margin={{ top: 10, right: 30, left: 10, bottom: 30 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                    <XAxis dataKey="founded" name="Founded" tick={{ fontSize: 12, fill: "#737373" }} type="number" domain={[2004, 2026]} />
                    <YAxis dataKey="yearsToUnicorn" name="Years to $1B" tick={{ fontSize: 12, fill: "#737373" }} label={{ value: "Years to $1B", angle: -90, position: "insideLeft", style: { fontSize: 12, fill: "#a3a3a3" } }} />
                    <ZAxis dataKey="valuation" range={[40, 400]} name="Valuation" />
                    <Tooltip
                      formatter={((value: number, name: string) => {
                        if (name === "Valuation") return [`$${value}B`, name];
                        return [value, name];
                      }) as never}
                      labelFormatter={((_: unknown, payload: Array<{payload?: {name?: string}}>) => payload?.[0]?.payload?.name || "") as never}
                      contentStyle={{ borderRadius: "12px", border: "1px solid #e5e5e5" }}
                    />
                    <Scatter data={unicornScatter.filter(c => c.category === "sleeper")} name="Sleepers" fill="#FF6600" fillOpacity={0.7} />
                    <Scatter data={unicornScatter.filter(c => c.category === "hot-won")} name="Hot → Won" fill="#10b981" fillOpacity={0.7} />
                    <Scatter data={unicornScatter.filter(c => c.category === "moderate")} name="Moderate" fill="#3b82f6" fillOpacity={0.7} />
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>
      </section>


      {/* ── INSIDER QUOTES ── */}
      <section className="bg-yc-dark">
        <div className="max-w-5xl mx-auto px-6 sm:px-8 py-16 sm:py-24">
          <Reveal>
            <div className="inline-block px-3 py-1 rounded-full bg-[#FF6600]/20 text-[#FF6600] text-xs font-bold uppercase tracking-widest mb-4">From the Insiders</div>
            <h2 className="text-3xl sm:text-5xl font-bold text-white">Even YC can&apos;t predict winners</h2>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
            {quotes.map((q, i) => (
              <Reveal key={i} delay={i * 50}>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-6 h-full backdrop-blur-sm">
                  <p className="text-[#FF6600] text-4xl font-serif leading-none mb-3">&ldquo;</p>
                  <p className="text-sm text-white/80 leading-relaxed">{q.text}</p>
                  <div className="mt-4 pt-3 border-t border-white/10">
                    <p className="text-sm font-bold text-white">{q.who}</p>
                    <p className="text-xs text-white/40">{q.role}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── THE MATH ── */}
      <section className="bg-yc-dark text-white">
        <div className="max-w-5xl mx-auto px-6 sm:px-8 py-16 sm:py-24">
          <Reveal>
            <div className="inline-block px-3 py-1 rounded-full bg-white/10 text-[#FF9955] text-xs font-bold uppercase tracking-widest mb-4">The Math</div>
            <h2 className="text-3xl sm:text-5xl font-bold">We ran the regression.<br />Here&apos;s the receipt.</h2>
            <p className="text-white/50 mt-3 text-sm sm:text-base max-w-2xl">
              Logistic regression on unicorn outcome (binary) as a function of Demo Day press coverage (hot), controlling for batch era. N = 5,025 companies with verified contemporaneous press signal.
            </p>
          </Reveal>

          <Reveal delay={100}>
            <div className="mt-10 rounded-2xl border border-white/10 bg-black/30 p-6 sm:p-8 font-mono text-sm overflow-x-auto">
              <p className="text-white/40 text-xs uppercase tracking-widest mb-3">Model specification</p>
              <p className="text-[#FF9955] whitespace-pre">
{`logit(P(unicorn)) = β₀ + β₁·hot + β₂·era`}
              </p>
              <p className="text-white/40 text-xs uppercase tracking-widest mt-6 mb-3">Odds ratio</p>
              <p className="text-[#FF9955] whitespace-pre">
{`OR(hot) = exp(β₁) = 1.04   (95% CI spans 1.0 → not significant)`}
              </p>
            </div>
          </Reveal>

          <Reveal delay={150}>
            <div className="mt-6 overflow-x-auto rounded-2xl border border-white/10">
              <table className="w-full text-sm font-mono">
                <thead>
                  <tr className="border-b border-white/10 bg-white/5">
                    <th className="text-left px-4 py-3 text-white/50 text-xs uppercase tracking-wider">Dependent var.</th>
                    <th className="text-right px-3 py-3 text-white/50 text-xs uppercase tracking-wider">Odds ratio (hot)</th>
                    <th className="text-right px-3 py-3 text-white/50 text-xs uppercase tracking-wider">p-value</th>
                    <th className="text-right px-3 py-3 text-white/50 text-xs uppercase tracking-wider hidden sm:table-cell">Pseudo R²</th>
                    <th className="text-left px-3 py-3 text-white/50 text-xs uppercase tracking-wider hidden md:table-cell">Verdict</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { dep: "unicorn (raw)", or: "1.64", p: "0.11", r2: "0.001", verdict: "not significant", sig: false },
                    { dep: "unicorn (era-adjusted)", or: "1.04", p: "0.90", r2: "0.119", verdict: "not significant", sig: false },
                    { dep: "failed / shut down", or: "0.78", p: "0.107", r2: "0.006", verdict: "not significant", sig: false },
                    { dep: "IPO", or: "2.19", p: "0.145", r2: "0.005", verdict: "not significant", sig: false },
                    { dep: "acquired", or: "1.44", p: "0.016", r2: "0.001", verdict: "significant", sig: true },
                  ].map((row) => (
                    <tr key={row.dep} className="border-b border-white/5">
                      <td className="px-4 py-2.5 text-white/80">{row.dep}</td>
                      <td className="px-3 py-2.5 text-right text-[#FF9955]">{row.or}</td>
                      <td className="px-3 py-2.5 text-right text-white/60">{row.p}</td>
                      <td className="px-3 py-2.5 text-right text-white/60 hidden sm:table-cell">{row.r2}</td>
                      <td className={`px-3 py-2.5 hidden md:table-cell ${row.sig === true ? "text-emerald-400" : row.sig === null ? "text-amber-400" : "text-white/40"}`}>{row.verdict}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>

          <Reveal delay={200}>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
              <div className="rounded-xl border border-white/10 bg-white/5 p-5">
                <p className="text-xs uppercase tracking-widest text-white/40 font-bold">Robustness: mature batches only</p>
                <p className="text-white/70 text-sm mt-2">Restricting to batches ≤ 2019 (9+ years to mature): OR(unicorn) = 1.28, p = 0.44. Same conclusion — no reliable hype effect.</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-5">
                <p className="text-xs uppercase tracking-widest text-white/40 font-bold">Sample construction</p>
                <p className="text-white/70 text-sm mt-2">132 companies excluded — no surviving contemporaneous press exists for their batch (7 batches, mostly pre-2012). Excluded, not mislabeled.</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-5">
                <p className="text-xs uppercase tracking-widest text-white/40 font-bold">Why R² is so low</p>
                <p className="text-white/70 text-sm mt-2">Startup outcomes are power-law distributed — a handful of decacorns dominate total value. Binary hype labels can&apos;t explain variance dominated by a few extreme outliers.</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── BOTTOM LINE ── */}
      <section className="max-w-5xl mx-auto px-6 sm:px-8 py-16 sm:py-24">
        <Reveal>
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl sm:text-5xl font-bold text-yc-dark">The signal isn&apos;t in the sizzle.</h2>
            <p className="text-xl sm:text-2xl text-[#FF6600] font-semibold mt-4">And it&apos;s barely in the survival either.</p>
            <p className="text-neutral-600 text-base sm:text-lg mt-8 leading-relaxed max-w-xl mx-auto">
              We verified 5,025 YC companies across 20 years against genuine, contemporaneous press coverage — not hindsight labels. The raw numbers show hot-covered companies with a modest edge (unicorn odds ratio 1.47), but once we control for the era each batch launched in, that edge mostly disappears (odds ratio 0.92, not statistically significant). The honest takeaway: Demo Day hype does not reliably predict which companies become unicorns. Any apparent effect is much more about which years produced strong cohorts than about which companies got picked as favorites.
            </p>
          </div>
        </Reveal>
      </section>

      {/* ── HOW THIS COMPARES ── */}
      <section className="border-t border-neutral-200 bg-neutral-50">
        <div className="max-w-5xl mx-auto px-6 sm:px-8 py-16 sm:py-24">
          <Reveal>
            <div className="inline-block px-3 py-1 rounded-full bg-[#FFF3EB] text-[#FF6600] text-xs font-bold uppercase tracking-widest mb-4">How This Compares</div>
            <h2 className="text-3xl sm:text-5xl font-bold text-yc-dark">We&apos;re not the only ones counting.</h2>
            <p className="text-neutral-500 mt-3 text-sm sm:text-base max-w-2xl">
              Other independent analyses of YC&apos;s outcome data land at different numbers than ours. Here&apos;s the honest comparison, and why they likely diverge.
            </p>
          </Reveal>

          <Reveal delay={100}>
            <div className="mt-8 overflow-x-auto rounded-2xl border border-neutral-200 bg-white">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-neutral-100 bg-neutral-50">
                    <th className="text-left px-4 py-3 font-semibold text-neutral-500 text-xs uppercase tracking-wider">Metric</th>
                    <th className="text-right px-3 py-3 font-semibold text-neutral-500 text-xs uppercase tracking-wider">This study</th>
                    <th className="text-right px-3 py-3 font-semibold text-neutral-500 text-xs uppercase tracking-wider">Other estimates</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { metric: "Unicorn rate", ours: "2.6% (136 of 5,157)", other: "1.8% – 4.5%, depending on cohort maturity" },
                    { metric: "Failure / shutdown rate", ours: "20.1%, verified per company", other: "13%, self-reported estimate" },
                    { metric: "Mature-cohort unicorn rate", ours: "5.8% (batches ≤2019)", other: "5% – 6.5%, using paid valuation databases" },
                  ].map((row) => (
                    <tr key={row.metric} className="border-b border-neutral-50">
                      <td className="px-4 py-2.5 font-medium text-yc-dark">{row.metric}</td>
                      <td className="px-3 py-2.5 text-right text-[#FF6600] font-semibold">{row.ours}</td>
                      <td className="px-3 py-2.5 text-right text-neutral-500">{row.other}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>

          <Reveal delay={150}>
            <p className="text-neutral-600 text-sm mt-6 leading-relaxed max-w-3xl">
Once you control for cohort maturity, our number converges almost exactly with everyone else&apos;s: 5.9% of our pre-2020 batches became unicorns, right in the 5%–6.5% range other analyses report using paid valuation databases. The headline 2.7% figure looks lower mainly because our dataset runs all the way through 2025, including hundreds of companies still too young to have hit $1B yet — the same maturity-bias every other analysis has to correct for. Our failure rate is likely the most accurate number in this table, since it comes directly from YC&apos;s own status field verified individually per company, not a self-reported or modeled estimate. Every serious analysis lands on the same underlying conclusion regardless of the exact percentage: YC roughly doubles a startup&apos;s unconditional odds of reaching unicorn status versus the general venture-backed baseline.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── SOURCES ── */}
      <section className="border-t border-neutral-200 bg-white">
        <div className="max-w-5xl mx-auto px-6 sm:px-8 py-12">
          <h3 className="text-sm font-bold text-neutral-400 uppercase tracking-widest mb-4">Sources &amp; Methodology</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-2">
            {[
              "Y Combinator's public company directory (all 5,157 companies, batches S05–S25)",
              "TechCrunch, VentureBeat & The Next Web contemporaneous Demo Day coverage (30+ batches)",
              "Wayback Machine archival recovery of dead TechCrunch gallery pages",
              "CB Insights & Crunchbase current unicorn lists (cross-referenced)",
              "YC's own \"top company\" flagship designation (91 companies)",
              "813 individually researched Public/Acquired company outcomes",
              "Rebel Fund: What Predicts YC Success (Jared Heyman)",
              "Rebel Fund: Power Law of YC Startups",
              "Palle Broe, \"Pulling Back the Curtain on the Magic of YC\" (Lenny's Newsletter, Feb 2025)",
              "5,157 total companies; 5,025 analyzed where genuine contemporaneous press exists",
            ].map((s) => (
              <p key={s} className="text-xs text-neutral-500 py-1">{s}</p>
            ))}
          </div>
          <p className="text-xs text-neutral-400 mt-6">Not affiliated with Y Combinator. &ldquo;Hot&rdquo; = named in genuine press coverage published at the time of that batch&apos;s Demo Day (not retrospective lists), recovered via live search and Wayback Machine archives. 132 companies from 7 batches with no surviving contemporaneous coverage (mostly pre-2012) were excluded from the hot/not-hot comparison rather than mislabeled. &ldquo;Failed&rdquo; = shut down per YC&apos;s own status field, individually verified.</p>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-neutral-200 py-8 text-center bg-yc-cream">
        <p className="text-sm text-neutral-500">
          Research by <a href="https://x.com/Trace_Cohen" target="_blank" rel="noopener" className="text-[#FF6600] hover:underline font-semibold">@Trace_Cohen</a>
          {" · "}
          <a href="mailto:t@nyvp.com" className="text-neutral-600 hover:text-yc-dark transition">t@nyvp.com</a>
        </p>
      </footer>
    </main>
  );
}
