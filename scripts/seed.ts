/**
 * MAISON — Seed Script
 * Run with: npx ts-node --project tsconfig.json scripts/seed.ts
 * Or: npx tsx scripts/seed.ts
 *
 * Requires: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local
 */

import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Unsplash fashion photography URLs
const FASHION_IMAGES = [
  "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&q=80",
  "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&q=80",
  "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80",
  "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800&q=80",
  "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800&q=80",
  "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80",
  "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800&q=80",
  "https://images.unsplash.com/photo-1485518882345-15568b007407?w=800&q=80",
  "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=800&q=80",
  "https://images.unsplash.com/photo-1544441893-675973e31985?w=800&q=80",
  "https://images.unsplash.com/photo-1554568218-0f1715e72254?w=800&q=80",
  "https://images.unsplash.com/photo-1583744946564-b52d01be9bc5?w=800&q=80",
  "https://images.unsplash.com/photo-1475180098004-ca77a66827be?w=800&q=80",
  "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=800&q=80",
  "https://images.unsplash.com/photo-1562572159-4efc207f5aff?w=800&q=80",
];

const getImage = (i: number) => FASHION_IMAGES[i % FASHION_IMAGES.length];

const collections = [
  {
    name: "Ready-to-Wear",
    slug: "ready-to-wear",
    description:
      "Seasonless pieces for the considered wardrobe. Each garment is made to be worn now and for years hence.",
    cover_image_url: FASHION_IMAGES[0],
    display_order: 1,
  },
  {
    name: "Outerwear",
    slug: "outerwear",
    description:
      "The outermost layer is the first thing the world sees. Coats and jackets that do not seek approval.",
    cover_image_url: FASHION_IMAGES[1],
    display_order: 2,
  },
  {
    name: "Knitwear",
    slug: "knitwear",
    description:
      "Slow-made knits from fine-gauge yarns. The warmth of something made by hand.",
    cover_image_url: FASHION_IMAGES[2],
    display_order: 3,
  },
  {
    name: "Trousers & Skirts",
    slug: "trousers-skirts",
    description:
      "Tailored bottoms that anchor a considered dressing practice.",
    cover_image_url: FASHION_IMAGES[3],
    display_order: 4,
  },
  {
    name: "Shirts & Blouses",
    slug: "shirts-blouses",
    description:
      "The quiet authority of a well-cut shirt. Woven from natural fibres that improve with wear.",
    cover_image_url: FASHION_IMAGES[4],
    display_order: 5,
  },
];

const productsByCollection: Record<string, any[]> = {
  "ready-to-wear": [
    {
      name: "Sandwashed Silk Slip Dress",
      price: 24500,
      is_featured: true,
      description:
        "Cut on the bias from a sandwashed silk charmeuse that moves with entirely its own logic, this slip dress is both architecture and water. The fabric — sourced from a weave house in Como that has operated for three generations — has been treated to soften its lustre without sacrificing its depth. The adjustable straps and barely-there side seams mean it disappears onto the body, leaving only the fabric itself visible. It layers over a long-sleeve turtleneck for autumn, or worn alone with nothing to interrupt its line. A garment that knows itself completely.",
      material: "100% Sandwashed Silk",
      care_instructions: "Hand wash cold in mild detergent. Lay flat to dry. Store on a padded hanger.",
      country_of_origin: "Italy",
      sizes: ["XS", "S", "M", "L"],
    },
    {
      name: "Chalk Stripe Wrap Dress",
      price: 19800,
      compare_at_price: 24000,
      description:
        "This dress borrows its structure from the tailoring tradition and its ease from nothing at all. The chalk stripe — a narrow chalk on a mid-grey ground — runs diagonally across the wrap front, creating an unbroken line from collar to hem. The fabric is a wool-blend suiting from a Yorkshire mill that has clothed people seriously for over a century. The wrap construction means it fits across a wide range of bodies without alteration. It arrives slightly oversized, designed to be belted loosely at the waist or left to fall as it chooses.",
      material: "78% Wool, 22% Polyester",
      care_instructions: "Dry clean only. Steam to refresh between wears.",
      country_of_origin: "United Kingdom",
      sizes: ["XS", "S", "M", "L", "XL"],
    },
    {
      name: "Washed Linen Kaftan",
      price: 16500,
      is_featured: true,
      description:
        "A garment that understands the value of doing nothing while doing it beautifully. This kaftan is cut from a pre-washed European linen that has been tumbled for hours to arrive at a softness that would otherwise take years of living. The volume is generous in the body and tapers at the hem, creating a shape that reads as deliberate. Side slits allow movement. The single broad pleat at the chest front is the only decoration the garment permits itself. It exists in a colour that has no precise name — somewhere between oat and ash.",
      material: "100% Pre-washed European Linen",
      care_instructions: "Machine wash cool. Do not tumble dry. Iron while slightly damp.",
      country_of_origin: "Portugal",
      sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    },
    {
      name: "Pintuck Jersey Midi Dress",
      price: 14200,
      description:
        "Jersey is not a forgiving fabric — it shows everything — which is precisely what makes this dress a statement of confidence. The fine pintucks at the front bodice introduce structure without rigidity, and the midi length falls with the weight of something that has considered exactly how far it wants to go. The fabric is a dense ponte from a Japanese mill, with enough body to retain its shape across a long day and enough stretch to not require it. It asks only that you wear it with intention.",
      material: "60% Rayon, 35% Nylon, 5% Elastane",
      care_instructions: "Machine wash delicate. Dry flat. Do not iron.",
      country_of_origin: "Japan",
      sizes: ["XS", "S", "M", "L", "XL"],
    },
    {
      name: "Felted Wool A-Line Dress",
      price: 22000,
      is_featured: true,
      description:
        "There is a particular quality of silence that comes with felted wool — the way it absorbs rather than reflects, the way it simply is. This A-line dress is cut from a double-faced felted wool that needs no lining, its interior as considered as its exterior. The A-line silhouette is neither large nor small — it is the precise amount of space the body needs to move comfortably within tailored confines. The concealed zip runs the full length of the back, opening the dress to a dimension its closed form only suggests.",
      material: "100% Double-faced Felted Wool",
      care_instructions: "Dry clean recommended. Hand wash in cold water if necessary.",
      country_of_origin: "Germany",
      sizes: ["XS", "S", "M", "L"],
    },
    {
      name: "Raw-Hem Denim Midi Skirt",
      price: 11800,
      description:
        "The raw hem is not a gesture of informality but of honesty — a garment that reveals rather than conceals the nature of its construction. This denim midi skirt is cut from a mid-weight Japanese selvedge denim in a washed indigo that will deepen and fade uniquely over years of wear. The A-line silhouette is slightly exaggerated, creating an old-fashioned fullness that sits in quiet opposition to its casual material. It is the kind of piece that anchors an entire wardrobe without announcing itself.",
      material: "100% Japanese Selvedge Denim",
      care_instructions: "Wash inside out on cold. Line dry. Never dry clean.",
      country_of_origin: "Japan",
      sizes: ["XS", "S", "M", "L", "XL"],
    },
    {
      name: "Draped Crepe Midi Dress",
      price: 18900,
      description:
        "Drape is a skill that requires understanding of gravity, fabric, and the body beneath — three forces in permanent negotiation. This dress puts that negotiation in full view, with a draped front panel that falls from a single shoulder and gathers at the hip in a way that can only be achieved with a crepe of this particular weight. The fabric is a matte viscose crepe imported from France, with a drape coefficient that allows it to hold its shape while appearing entirely weightless. The asymmetric hem adds exactly one degree of interest.",
      material: "100% Viscose Crepe",
      care_instructions: "Hand wash or dry clean. Short gentle cycle only.",
      country_of_origin: "France",
      sizes: ["XS", "S", "M", "L", "XL"],
    },
    {
      name: "Open-Back Jersey Top",
      price: 8900,
      description:
        "The back of a garment is often where its true character lives. This open-back jersey top presents a composed front — a slight V-neck, three-quarter sleeves, clean lines — and reveals its full self only when turned away. The back drops to a sophisticated low point, held in place by a single fine cord that ties in a reef knot at the centre. The jersey is a dense modal blend from a supplier in southern Germany with a skin-like softness and excellent recovery.",
      material: "85% Modal, 15% Elastane",
      care_instructions: "Machine wash delicate cold. Lay flat to dry.",
      country_of_origin: "Germany",
      sizes: ["XS", "S", "M", "L", "XL"],
    },
    {
      name: "Cocoon Linen Dress",
      price: 17500,
      description:
        "A silhouette that offers the body complete freedom while appearing entirely deliberate. This cocoon dress is cut in three panels — two at front, one at back — from a heavy Irish linen that holds its shape without support. The hem falls several inches below the knee, and the lack of a defined waist is precisely the point: this is a dress that belongs to no decade and could be worn in any of them. The only detail permitted is a small pocket at the left hip, set flush with the seam.",
      material: "100% Irish Linen",
      care_instructions: "Machine wash warm. Iron hot while damp for a clean finish.",
      country_of_origin: "Ireland",
      sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    },
    {
      name: "Bias-Cut Satin Skirt",
      price: 13500,
      is_featured: true,
      description:
        "The bias cut was invented to make fabric behave like skin — to move with the body rather than around it. This midi-length satin skirt takes that principle seriously. Cut at a precise 45-degree angle from a heavy-weight charmeuse, it flows with the kind of authority that only comes from understanding the physics of cloth. The waistband is a simple fold of the same fabric, fastened at the side with two small buttons. It is designed to be worn with a tucked-in shirt, a knit, or nothing at all above the waist.",
      material: "100% Polyester Charmeuse with a silk-like drape",
      care_instructions: "Hand wash in cold water. Do not wring. Hang to dry.",
      country_of_origin: "China",
      sizes: ["XS", "S", "M", "L"],
    },
    {
      name: "Structured Poplin Shirtdress",
      price: 15800,
      description:
        "A shirtdress understands the value of a clear decision. This one is made from a fine Egyptian cotton poplin with a thread count that gives it the slightly formal quality of something pressed freshly that morning, even two hours into a day. The collar is a single-button stand collar, not a full collar — a small difference that changes the entire register of the garment. The shirt placket runs to the waist, below which the skirt falls in a gentle A-line to the knee. Functional patch pockets at the level of the hip.",
      material: "100% Egyptian Cotton Poplin",
      care_instructions: "Machine wash hot. Iron while damp at high heat.",
      country_of_origin: "Egypt",
      sizes: ["XS", "S", "M", "L", "XL"],
    },
    {
      name: "Velvet Slip Midi Dress",
      price: 21500,
      is_featured: true,
      description:
        "Velvet has the capacity to absorb light and return nothing but colour — a quality that makes it simultaneously ostentatious and austere. This slip dress in crushed velvet navigates that paradox deliberately. The crushed finish softens what would otherwise be a very formal fabric, bringing it into a more ambiguous register that reads differently depending on what it is worn with. The thin straps are set wide enough to allow the collarbone to show completely. The skirt is cut slightly A-line, falling with the kind of weight that velvet naturally carries.",
      material: "80% Viscose, 20% Silk Velvet",
      care_instructions: "Dry clean only. Store hanging, not folded.",
      country_of_origin: "Italy",
      sizes: ["XS", "S", "M", "L"],
    },
  ],
  "outerwear": [
    {
      name: "Brushed Cashmere Overcoat",
      price: 89500,
      is_featured: true,
      description:
        "Cut from a brushed wool-cashmere blend woven in a small mill in the Abruzzo region, this coat moves with the body without surrendering structure. The slightly dropped shoulder and single concealed button create a silhouette that is at once restrained and deliberate. The lining is a thin silk charmeuse that allows the coat to slide on and off with the ease of something worn many times before. The collar can be worn flat or turned up without it reading as a choice that requires explanation. A coat that has already decided what it is.",
      material: "70% Cashmere, 30% Virgin Wool",
      care_instructions: "Dry clean only. Store on a wide-shouldered hanger.",
      country_of_origin: "Italy",
      sizes: ["XS", "S", "M", "L", "XL"],
    },
    {
      name: "Waxed Cotton Field Jacket",
      price: 34500,
      description:
        "A field jacket is the working garment of the person who works outside — which is, at some level, all of us. This jacket is cut from a traditional waxed cotton that has been manufactured in Scotland using a method that predates the synthetic era. The wax treatment renders it largely waterproof and entirely windproof, and develops a character over time that becomes specific to its wearer. Four exterior pockets, one interior, all secured by press studs. The collar is unlined and softens with wear.",
      material: "100% Waxed Cotton",
      care_instructions: "Wipe clean with cold water. Never machine wash. Re-wax annually.",
      country_of_origin: "Scotland",
      sizes: ["S", "M", "L", "XL", "XXL"],
    },
    {
      name: "Double-Faced Wool Cocoon Coat",
      price: 72000,
      is_featured: true,
      description:
        "Double-faced wool is a technical achievement that allows a garment to exist without a conventional lining — the inner face of the fabric is as finished as the outer, and the two layers are bonded at the seams in a way that is invisible from either side. This cocoon coat uses that technology in service of a silhouette that has been refined down to its essential shape: large, round, clean. There is no belt, no collar detail, no button — only the coat and the body inside it, negotiating their relationship.",
      material: "100% Double-faced Felted Wool",
      care_instructions: "Dry clean only. Brush regularly to maintain surface.",
      country_of_origin: "Belgium",
      sizes: ["XS", "S", "M", "L", "XL"],
    },
    {
      name: "Merino Knit Cardigan Coat",
      price: 42000,
      description:
        "At a certain point a cardigan becomes a coat — a garment with enough presence to serve as the final layer on a mild day but enough intimacy to be worn at home in the morning while considering the day. This cardigan coat is that garment. It is knitted in a heavyweight merino on industrial circular beds that produce a gauge dense enough to hold its architecture without lining. The shawl collar falls open or closes — it makes this decision independently. Two deep side pockets are set slightly towards the front, where hands naturally arrive.",
      material: "100% Fine Merino Wool",
      care_instructions: "Hand wash cold. Dry flat. Do not hang.",
      country_of_origin: "Scotland",
      sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    },
    {
      name: "Raw Denim Trucker Jacket",
      price: 22500,
      description:
        "The trucker jacket is a garment that has earned its position in the wardrobe through decades of utility and adaptation. This version is made from a raw selvedge denim from a mill in Kojima, Japan — a region that has been producing denim according to its own strict methodology since the 1960s. The jacket is cut slightly shorter and looser than the classic proportions, with a chest pocket that closes on a single button and cuffs long enough to fold. It will fade uniquely around the wrist, pocket corners, and collar with wear.",
      material: "100% Raw Japanese Selvedge Denim",
      care_instructions: "Do not wash for first 6 months of wear. Spot clean only initially. First wash inside out cold.",
      country_of_origin: "Japan",
      sizes: ["S", "M", "L", "XL"],
    },
    {
      name: "Shearling Aviator Jacket",
      price: 65000,
      is_featured: true,
      description:
        "The aviator jacket was made to protect people in an unheated cockpit at altitude. This version does not need to protect anyone from anything — which is why it can afford to think carefully about proportion, weight, and texture. The shearling is a Spanish merino, with a fleece of even density and a skin that has been vegetable tanned to a supple, warm brown. The leather exterior is heavy-gauge and will develop a patina over years that becomes eventually irreplaceable. The collar folds inward or stands upright without stiffness.",
      material: "Exterior: Full-grain calf leather. Interior: Spanish merino shearling.",
      care_instructions: "Professional leather cleaning only. Condition annually with natural leather balm.",
      country_of_origin: "Spain",
      sizes: ["S", "M", "L", "XL"],
    },
    {
      name: "Technical Nylon Anorak",
      price: 28000,
      description:
        "The anorak's logic is simple: a single opening at the front, no zip, no button — just a garment that goes on in one motion and creates a sealed environment against wind and light rain. This technical nylon version takes that logic and refines it through a fabric that is both highly breathable and wholly windproof. The hood is not adjustable in the conventional sense — it is cut with enough volume to accommodate most head sizes without cinching. Two discreet side pockets are accessible through the body of the jacket rather than set into it.",
      material: "100% Recycled Nylon Shell with DWR treatment",
      care_instructions: "Machine wash cool. Tumble dry low to reactivate DWR coating. Do not iron.",
      country_of_origin: "Taiwan",
      sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    },
    {
      name: "Camel Wool Polo Coat",
      price: 78000,
      is_featured: true,
      description:
        "The polo coat has a history rooted in the between-chukker break — something warm and enveloping for a moment between effort. It translates perfectly to the city, where the moment between effort is the permanent condition of a certain kind of living. This version uses a camel wool — sourced from Bactrian camels in Mongolia, combed rather than shorn — of exceptional warmth-to-weight ratio and a natural colour that requires no dyeing. The double-breasted front, wide lapels, and belted back are all as they should be.",
      material: "100% Mongolian Camel Wool",
      care_instructions: "Dry clean only. Air between wears on a padded hanger.",
      country_of_origin: "Mongolia",
      sizes: ["XS", "S", "M", "L", "XL"],
    },
    {
      name: "Cotton Gabardine Trench",
      price: 45000,
      description:
        "The trench coat has been worn by people doing consequential things for over a century. This version respects that history without being nostalgic about it. The cotton gabardine is a densely woven twill that is water-resistant in its construction rather than through any applied treatment — the tightness of the weave itself provides the barrier. The double-breasted front closes on regimental buttons. The storm flap, epaulettes, and D-ring belt are all present and accounted for. The lining is a fine cotton lawn.",
      material: "100% Cotton Gabardine",
      care_instructions: "Machine wash warm. Dry on hanger. Iron at medium heat.",
      country_of_origin: "United Kingdom",
      sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    },
    {
      name: "Padded Silk Bomber",
      price: 32000,
      description:
        "The bomber jacket invites informality in its silhouette but refuses it in its material. This version uses a dense silk duchesse for its exterior — a fabric typically reserved for occasion dressing — and fills it with a lightweight down that provides warmth without adding unnecessary volume. The interior is a contrast silk satin. The rib collar, cuffs, and hem are knitted in a silk-nylon blend that approximates the original cotton rib without its bulk. The result is something that has made a decision about the relationship between casual and formal.",
      material: "Exterior: 100% Silk Duchesse. Fill: 80/20 Down. Rib: Silk-Nylon blend.",
      care_instructions: "Dry clean only. Store folded when not in use.",
      country_of_origin: "Italy",
      sizes: ["XS", "S", "M", "L"],
    },
  ],
  "knitwear": [
    {
      name: "Merino Rib-Knit Polo",
      price: 12500,
      is_featured: true,
      description:
        "The polo neck is a garment of absolute commitment. There is no collar to adjust, no opening to negotiate — it simply closes around the neck and presents a continuous clean line to the world. This polo is knitted in a fine-gauge Merino at 18 stitches per inch, creating a fabric dense enough to hold its rib definition over many years of wearing, washing, and wearing again. The neck itself is slightly taller than is strictly necessary — the extra height creates a small fold that is the only decoration the garment allows itself.",
      material: "100% Extra-Fine Merino Wool (17.5 micron)",
      care_instructions: "Hand wash cold or machine wash on wool cycle. Dry flat. Do not tumble dry.",
      country_of_origin: "Scotland",
      sizes: ["XS", "S", "M", "L", "XL"],
    },
    {
      name: "Alpaca Chunky Rib Sweater",
      price: 28500,
      is_featured: true,
      description:
        "Alpaca is a fibre that has no memory for shape — it falls rather than holds — and this quality is precisely what gives this sweater its character. The chunky rib is knitted from a Peruvian baby alpaca on an industrial gauge wide enough to produce a fabric with visible texture but without the roughness that comes from a coarser animal fibre. The drop shoulder means the sleeve starts where the arm rests, creating a silhouette that suggests ease without requiring it. The fit is relaxed enough to layer over a shirt, or worn as the final word on a cold-weather day.",
      material: "100% Baby Alpaca",
      care_instructions: "Hand wash cold only. Store folded, never hang. Use cedar to protect from moths.",
      country_of_origin: "Peru",
      sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    },
    {
      name: "Cashmere Crew Neck",
      price: 45000,
      is_featured: true,
      description:
        "A cashmere crew neck is the garment against which all other knitwear is measured. This one is made from a two-ply Grade A Mongolian cashmere that has been combed — not cut — from the underbelly of Hircus goats in Inner Mongolia during the spring moulting. The yarn is spun in a mill in Ulanbataar that operates under cooperative ownership and international quality standards. The crew neck is set at the point where it reads as a crew rather than a turtleneck — a precision that requires the garment to know the difference.",
      material: "100% Grade A Mongolian Cashmere",
      care_instructions: "Hand wash cold with cashmere shampoo. Dry flat on a towel. Pilling will reduce with wear.",
      country_of_origin: "Mongolia",
      sizes: ["XS", "S", "M", "L", "XL"],
    },
    {
      name: "Fisherman Rib Cotton Sweater",
      price: 15800,
      description:
        "The fisherman rib dates from a tradition of practical working garments that were made to keep people warm during long hours in cold, wet conditions. It achieves this through its structural depth — the rib is knitted with a slip stitch that creates a fabric nearly twice the thickness of conventional rib at the same gauge. This cotton version is knitted in a heavy Egyptian cotton that is simultaneously cool enough for autumn and warm enough for winter with the right layering. The fit is intentionally generous.",
      material: "100% Heavy Egyptian Cotton",
      care_instructions: "Machine wash cool. Dry flat or on a hanger away from direct heat.",
      country_of_origin: "Portugal",
      sizes: ["S", "M", "L", "XL", "XXL"],
    },
    {
      name: "Fine Gauge Silk Knit Shell",
      price: 19500,
      description:
        "Silk knit occupies a territory between fabric and nothing — it has the presence of something substantial but drapes as though gravity has made a special exception. This shell top is knitted at 32 stitches per inch from a 2-ply silk that produces a fabric fine enough to see through but heavy enough to hold its shape. The sleeveless cut with a slight cowl at the back neck creates a garment that can be worn alone or layered beneath anything without adding visible bulk. The colour is a muted champagne that reads differently under different lights.",
      material: "100% Mulberry Silk",
      care_instructions: "Hand wash only in cold water with silk wash. Do not wring. Dry flat away from sun.",
      country_of_origin: "China",
      sizes: ["XS", "S", "M", "L"],
    },
    {
      name: "Mohair Boxy Cardigan",
      price: 22000,
      description:
        "Mohair's virtue and its challenge are the same thing: its halo. The fine, light fibres that extend beyond the yarn's core give mohair garments their characteristic softness and their equally characteristic tendency to go where they want. This boxy cardigan accommodates the halo by keeping its silhouette large enough that the fiber cloud reads as intentional rather than neglected. Knitted from a kid mohair blended with a small percentage of silk to control the fluffiness. The buttons are polished horn.",
      material: "72% Kid Mohair, 28% Silk",
      care_instructions: "Hand wash very gently in cold water. Dry flat. Do not press.",
      country_of_origin: "Italy",
      sizes: ["XS", "S", "M", "L", "XL"],
    },
    {
      name: "Linen-Cotton Knit Vest",
      price: 10500,
      description:
        "A garment that belongs to the space between seasons — too warm to need much, too cool to need nothing. This knit vest is worked from a linen-cotton yarn that is simultaneously breathable and substantial, allowing it to serve as a mid-layer in cold months or a standalone piece in transitional ones. The V-neck is cut to precisely the depth that exposes without revealing — a measurement that varies by millimetres but is felt completely. The hem drops slightly at the back, a detail that allows it to layer over longer shirts without creating bulk.",
      material: "55% Linen, 45% Cotton",
      care_instructions: "Machine wash cool. Dry flat. The fabric will soften further with washing.",
      country_of_origin: "Lithuania",
      sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    },
    {
      name: "Intarsia Wool Sweater",
      price: 38000,
      description:
        "Intarsia is the most labour-intensive technique in machine knitting — each block of colour requires a separate yarn carrier, and the pattern must be mapped stitch by stitch before a single row is knitted. This sweater uses a two-colour intarsia — a warm off-white and a deep earth — in a geometric arrangement that reads as abstract from across the room and reveals its structure on closer inspection. The base yarn is a 4-ply lambswool that will soften with every wash.",
      material: "100% Lambswool",
      care_instructions: "Hand wash cold or machine wash on wool cycle. Dry flat. Reshape while damp.",
      country_of_origin: "Scotland",
      sizes: ["XS", "S", "M", "L", "XL"],
    },
    {
      name: "Oversized Wool Turtleneck",
      price: 26500,
      is_featured: true,
      description:
        "An oversized turtleneck is a statement of serious intent. It takes up space, it adds warmth beyond necessity, it says something about the value of comfort in a world that has forgotten it. This version is knitted in a 12-ply aran-weight wool from a cooperative in County Mayo that has been spinning since the last century. The turtleneck is long enough to fold, or not — this is a garment that accepts multiple ways of being. The drop shoulder extends the sleeve past the wrist, designed to be pushed up.",
      material: "100% Irish Aran Wool",
      care_instructions: "Hand wash in cold water with wool wash. Reshape and dry flat. Do not tumble dry.",
      country_of_origin: "Ireland",
      sizes: ["One Size"],
    },
    {
      name: "Striped Breton Knit",
      price: 13200,
      description:
        "The Breton stripe is one of the most efficient visual systems in clothing — it reads as itself without explanation and conveys a quality of informal ease without effort. This sweater is knitted in a fine-gauge cotton in the traditional navy and ecru stripe proportions, though the gauge is finer than the classic marinière, lending it a lightness that moves it towards four-season wear. The boat neck is cut wide and low, showing the collarbone without the garment needing to do anything else. A garment that has been working for a century.",
      material: "100% Organic Cotton",
      care_instructions: "Machine wash cool. The colours will deepen with washing. Dry flat to maintain shape.",
      country_of_origin: "France",
      sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    },
    {
      name: "Waffle-Knit Thermal Top",
      price: 9800,
      description:
        "The waffle knit is a structural achievement — its hexagonal cells trap and retain air more efficiently than a flat fabric of equivalent weight, making it warmer than it appears. This base-layer top uses that property in a fine merino yarn that is both temperature-regulating and naturally odour-resistant. The fit is close without constricting — designed to be worn under other garments without adding visible bulk at the collar or cuffs. The long sleeves are finished with a thumb hole, a detail that serves a genuine purpose.",
      material: "100% Superfine Merino Wool",
      care_instructions: "Machine wash on wool cycle cold. Do not tumble dry. Store folded.",
      country_of_origin: "New Zealand",
      sizes: ["XS", "S", "M", "L", "XL"],
    },
  ],
  "trousers-skirts": [
    {
      name: "Chalk-Stripe Wide-Leg Trouser",
      price: 18500,
      is_featured: true,
      description:
        "The wide-leg trouser in a chalk stripe is a garment making a position statement about the relationship between casual and formal. The chalk stripe — a fine chalk line on charcoal ground — traditionally belongs to suit trousers; extracting it into a wide-leg cut creates a productive tension that makes the garment interesting. The fabric is a wool-blend suiting from a mill that has been supplying London tailors for three generations. The waistband is elasticated at the back only, allowing the front to sit flat and clean without the need for a belt.",
      material: "72% Wool, 28% Polyester",
      care_instructions: "Dry clean recommended. Press with a damp cloth to maintain the crease.",
      country_of_origin: "United Kingdom",
      sizes: ["XS", "S", "M", "L", "XL"],
    },
    {
      name: "Fluid Silk Cargo Trousers",
      price: 29000,
      description:
        "The cargo trouser and the silk trouser are not naturally related. Bringing them together requires a conviction that the utility of the cargo pocket — a genuine hand-sized pocket set at mid-thigh — can coexist with the drape and lustre of a silk charmeuse. It can, and this trouser demonstrates it. The four pockets (two side, two cargo) are all functional. The fluid leg means the garment hangs; it does not fit so much as accompany the body. The elasticated waistband preserves the clean line of the front.",
      material: "100% Silk Charmeuse",
      care_instructions: "Hand wash cold. Do not wring. Dry hanging. Iron at low heat on reverse.",
      country_of_origin: "China",
      sizes: ["XS", "S", "M", "L", "XL"],
    },
    {
      name: "Pressed-Crease Wool Trousers",
      price: 24000,
      description:
        "A pressed crease in a trouser leg is not decoration — it is a declaration of order. These trousers are cut from a mid-weight Japanese wool twill with a crease set permanently in the front through a combination of steam and time, in a process that the mill has been refining since the 1970s. The trouser is straight-leg, falling from the hip to the ankle without deviation, creating a clean vertical line that organises everything above and below it. Two side pockets and one back hip pocket, all sewn with thread that matches the ground precisely.",
      material: "100% Japanese Wool Twill",
      care_instructions: "Dry clean only to preserve the crease. Steam to refresh between cleanings.",
      country_of_origin: "Japan",
      sizes: ["XS", "S", "M", "L", "XL"],
    },
    {
      name: "Pleated Linen Trousers",
      price: 16500,
      description:
        "The pleat in a trouser is the most honest kind of tailoring: it says that the body will need more room than a flat pattern allows, and provides it upfront rather than in a side seam. These trousers use a double forward pleat — two folds of fabric on each leg that open as the body moves and close as it stills. The linen is a mid-weight European flax, woven loosely enough to breathe and apress enough to hold a gentle shape. The wide-set pockets mean the hands have somewhere to be.",
      material: "100% European Linen",
      care_instructions: "Machine wash cool. Press while damp. The fabric will soften beautifully over time.",
      country_of_origin: "Belgium",
      sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    },
    {
      name: "Velvet Midi Skirt",
      price: 21000,
      is_featured: true,
      description:
        "Velvet in a midi skirt makes the same argument as velvet in a dress: that luxury is not about occasion but about the daily experience of the body in cloth. This skirt is made from a crushed velvet in a deep bottle green — a colour that sits at the edge of neutral, comfortable beside most things in a wardrobe without disappearing into them. The A-line cut creates a shape that is neither column nor full skirt, occupying its own territory. The fully elasticated waistband is a practical concession that enables the shape of everything below it.",
      material: "85% Viscose, 15% Nylon Velvet",
      care_instructions: "Dry clean only. Store hanging, never folded.",
      country_of_origin: "Italy",
      sizes: ["XS", "S", "M", "L", "XL"],
    },
    {
      name: "Raw Silk Pleated Skirt",
      price: 18800,
      description:
        "Raw silk has a particular quality of being both refined and raw at the same time — the uneven texture of the thread's surface catches light and distributes it unpredictably, creating a fabric that appears different from every angle. This pleated midi skirt takes that optical quality and gives it movement through box pleats that open slightly with each step and close again at rest. The waistband is a clean two-inch band of the same fabric, fastening at the side with a single horn button. The hem sits precisely at mid-calf.",
      material: "100% Raw Silk",
      care_instructions: "Dry clean only. The texture of raw silk cannot be restored after incorrect washing.",
      country_of_origin: "India",
      sizes: ["XS", "S", "M", "L"],
    },
    {
      name: "Japanese Denim Barrel Skirt",
      price: 15200,
      description:
        "The barrel skirt is a silhouette that arrived fully formed — a shape that narrows at the hem creating a volume in the upper body of the skirt that is neither A-line nor pencil. This version in a mid-weight Japanese denim brings the casual intelligence of the barrel into everyday territory. The denim is a 13oz selvedge in a warm indigo that has been washed to a comfortable softness while retaining its structure. The hem is narrowed by approximately four inches on each side seam, creating the signature shape without any internal boning or stiffening.",
      material: "100% Japanese Selvedge Denim, 13oz",
      care_instructions: "Machine wash inside out, cold. Line dry. Iron inside out.",
      country_of_origin: "Japan",
      sizes: ["XS", "S", "M", "L", "XL"],
    },
    {
      name: "Tailored Bermuda Shorts",
      price: 12500,
      description:
        "The Bermuda short has a specific length — two inches above the knee — that places it in a zone of neither casual nor formal. This tailored version in a cotton-linen blend sits in that zone deliberately, with a fly front, belt loops, and slant pockets that suggest the construction of a full trouser applied to a garment that ends at a precise point above the knee. The fabric is a summer-weight suiting cloth from a Portuguese mill known for its handling of natural fibres. A garment for the considered summer.",
      material: "55% Cotton, 45% Linen",
      care_instructions: "Machine wash cool. Press with steam while slightly damp.",
      country_of_origin: "Portugal",
      sizes: ["XS", "S", "M", "L", "XL"],
    },
    {
      name: "Satin Maxi Skirt",
      price: 17000,
      description:
        "A maxi skirt creates a specific relationship with the floor — one that suggests either intention or accident, and this one intends it completely. Cut from a heavy satin with a matte reverse, it falls from the hip to ankle in a single clean line with a small kick at the hem that allows walking without interference. The waistband is a fold of the same satin, fastening at the side with a concealed zip that disappears into the seam. The fabric is available in a colour scheme that reads differently under artificial and natural light.",
      material: "100% Polyester Satin, matte reverse",
      care_instructions: "Machine wash delicate cold. Dry on hanger. Do not iron.",
      country_of_origin: "South Korea",
      sizes: ["XS", "S", "M", "L", "XL"],
    },
    {
      name: "Wool Culotte",
      price: 16800,
      description:
        "The culotte sits halfway between a trouser and a skirt and commits to neither, which is precisely its value. This wool version is cut from a mid-weight Italian flannel in a herringbone weave that reads as a solid at a distance and reveals its pattern on approach. The graduated hem — shorter at the front and longer at the back — allows the fabric to fall at a flattering diagonal. The waistband is a clean four-stitch elastic on the inside only, leaving the outside looking as structured as a properly tailored piece.",
      material: "100% Italian Merino Flannel",
      care_instructions: "Dry clean or hand wash cold. Dry flat. Steam to remove creases.",
      country_of_origin: "Italy",
      sizes: ["XS", "S", "M", "L", "XL"],
    },
  ],
  "shirts-blouses": [
    {
      name: "Laundered Linen Shirt",
      price: 12800,
      is_featured: true,
      description:
        "Linen that has been properly laundered before garment construction has already done the most difficult part of its growing — it has relaxed. The fibres have opened, the weave has settled, and the fabric has found its permanent dimension. This shirt is cut from such a linen — a mid-weight Irish flax that was washed repeatedly before cutting — meaning it arrives already at its best, with a softness that would otherwise take years of wear to achieve. The collar is an open collar, designed to be worn open at the first two buttons or closed at the neck.",
      material: "100% Pre-washed Irish Linen",
      care_instructions: "Machine wash hot. Dry on hanger. Iron damp at high heat for a clean finish, or not at all for a lived-in one.",
      country_of_origin: "Ireland",
      sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    },
    {
      name: "Silk Charmeuse Blouse",
      price: 22500,
      is_featured: true,
      description:
        "A silk blouse carries a particular authority — the sheen communicates something that no amount of tailoring can substitute. This blouse in a heavy-weight charmeuse uses that authority deliberately, cut in a long-bodied style that tucks or untucks with equal conviction. The cuffs are a single-button style, slightly deep to allow the sleeve to roll once without becoming bulky. The front opening is fastened with small covered buttons that disappear into the placket. The collar is a feminine version of a stand collar, closing at the neck without height.",
      material: "100% Mulberry Silk Charmeuse",
      care_instructions: "Hand wash cold or dry clean. Do not tumble dry. Press on reverse with cool iron.",
      country_of_origin: "China",
      sizes: ["XS", "S", "M", "L", "XL"],
    },
    {
      name: "Poplin Oxford Shirt",
      price: 10800,
      description:
        "The oxford shirt is a garment that has finished arguing with itself. It is informal rather than formal; it is cotton; it is a shirt. This version uses a finely woven poplin rather than the traditional basket weave, giving it a slightly more polished surface that allows it to move more easily between contexts. The cut is slightly boxy — not oversized but roomier than a slim fit — with a curved hem designed to be worn untucked without looking unintentional. The button-down collar is a concession to the original and is left unpressed.",
      material: "100% Egyptian Cotton Poplin",
      care_instructions: "Machine wash warm. Dry on hanger. Iron at high heat while damp.",
      country_of_origin: "Egypt",
      sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    },
    {
      name: "Broderie Anglaise Cotton Blouse",
      price: 14200,
      description:
        "Broderie anglaise is embroidery in its most democratic form — cut-work placed into cotton voile by industrial needles operating at speeds that no human hand could approach. This blouse uses it without apology: a large broderie panel at the front bodice and cuffs, placed against a plain cotton poplin back and shoulders. The result is a garment that lends itself to being looked at closely, where the embroidery reveals its intricacy, but reads as a simple light garment at a distance. It is self-conscious in the best way.",
      material: "100% Cotton (Voile + Poplin)",
      care_instructions: "Machine wash cool. Dry flat. Iron the plain sections only; the broderie should be left as-is.",
      country_of_origin: "India",
      sizes: ["XS", "S", "M", "L", "XL"],
    },
    {
      name: "Voile Smocked Blouse",
      price: 13500,
      description:
        "Smocking uses gathered fabric to create a controlled texture at the surface of a garment that allows expansion and contraction as the body moves within it. At the chest and at the cuffs, this cotton voile blouse uses that technique in an even geometric pattern, creating structure at the points where structure is needed and releasing completely below the smocked section into a full-cut body that falls away from the chest. The fabric is a fine cotton voile, nearly sheer against the light, and the smocking is worked in a thread one shade darker than the ground.",
      material: "100% Cotton Voile",
      care_instructions: "Machine wash delicate cool. Do not press the smocking directly. Iron the body of the blouse only.",
      country_of_origin: "India",
      sizes: ["XS", "S", "M", "L", "XL"],
    },
    {
      name: "Oversized Poplin Tunic",
      price: 11500,
      description:
        "A tunic exists in the space between a shirt and a dress — it is too long to be fully a shirt but too short to commit to being a dress. This understated tension gives it its usefulness. The poplin is a heavier grade than a shirt poplin — thick enough to provide opacity without the stiffness of a canvas. The deep arm openings and generously cut body mean it sits on the body rather than clinging to it, creating a garment that is equally appropriate worn alone or layered over narrow trousers. The hem falls at the upper thigh.",
      material: "100% Heavy Cotton Poplin",
      care_instructions: "Machine wash warm. Tumble dry on medium. Iron hot.",
      country_of_origin: "Portugal",
      sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    },
    {
      name: "Banded Collar Voile Shirt",
      price: 12200,
      description:
        "The banded collar — sometimes called a Grandad collar or Nehru collar — removes the lapel fold that a conventional collar requires and replaces it with nothing. The neck is exposed, the shirt opens at the top button, and the remaining structure of the garment carries the visual weight. In a voile, this reads as extremely light — the fabric is semi-transparent and moves with breath alone. This shirt uses it in a loose-cut construction, the kind of shirt that belongs somewhere near the sea with sun and salt water.",
      material: "100% Cotton Voile",
      care_instructions: "Machine wash cool. Dry on hanger while damp. No ironing required.",
      country_of_origin: "France",
      sizes: ["XS", "S", "M", "L", "XL"],
    },
    {
      name: "Wrapped Front Blouse",
      price: 15800,
      description:
        "The wrap front creates a V-neckline that closes through physics — the left panel crossing the right and secured in a tie at the inside seam — rather than fastenings. This means it adjusts continuously to the body rather than being fixed at a single point. This blouse uses the wrap construction in a fluid viscose crepe that drapes with intelligence, falling into soft folds at the tie point and then releasing into a clean skimming silhouette below. The sleeves are three-quarter length, ending at the forearm where the arm is at its most visible.",
      material: "100% Viscose Crepe",
      care_instructions: "Hand wash cool. Dry flat or on hanger. Gentle iron if needed.",
      country_of_origin: "France",
      sizes: ["XS", "S", "M", "L", "XL"],
    },
    {
      name: "Windowpane Check Shirt",
      price: 13800,
      description:
        "The windowpane check is the gentlest of the check family — large squares formed by a single thread over a plain ground, visible enough to register but quiet enough to combine with other patterns without argument. This shirt uses it in a wool-cotton blend that sits comfortably in the space between shirting and suiting fabrics. The cut is a slightly boxy regular fit, with set-in sleeves and a single breast pocket offset from centre by two inches — a detail that almost nobody notices and which adds something immeasurable.",
      material: "60% Wool, 40% Cotton",
      care_instructions: "Dry clean or hand wash cold. Dry flat. Press on reverse.",
      country_of_origin: "United Kingdom",
      sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    },
    {
      name: "Puffed-Sleeve Cotton Blouse",
      price: 11200,
      description:
        "The puffed sleeve is a deliberate excess — fabric gathered into a cuff that creates a volume at the upper arm that the arm does not require, which is precisely why it exists. This blouse uses modest puffs — enough to register as an intention rather than a costume — in a heavy cotton poplin that holds the gathered shape without boning or padding. The body of the blouse is plain and straight, falling loosely from the shoulder to the hip. The collar is a small spread collar with pointed tips that can be worn open or closed at the first button.",
      material: "100% Cotton Poplin",
      care_instructions: "Machine wash warm. Iron while damp at medium-high heat to maintain the puff shape.",
      country_of_origin: "Portugal",
      sizes: ["XS", "S", "M", "L", "XL"],
    },
  ],
};

async function seed() {
  console.log("🌱 Starting Maison seed...\n");

  // 1. Create collections
  console.log("Creating collections...");
  const { data: createdCollections, error: colErr } = await supabase
    .from("collections")
    .upsert(collections, { onConflict: "slug" })
    .select();

  if (colErr) {
    console.error("Collections error:", colErr);
    process.exit(1);
  }
  console.log(`✓ Created ${createdCollections?.length} collections\n`);

  // Map slug to id
  const collectionMap = Object.fromEntries(
    (createdCollections || []).map((c: any) => [c.slug, c.id])
  );

  // 2. Create products
  let totalProducts = 0;
  for (const [collectionSlug, products] of Object.entries(productsByCollection)) {
    const collectionId = collectionMap[collectionSlug];
    if (!collectionId) {
      console.warn(`⚠ No collection found for slug: ${collectionSlug}`);
      continue;
    }

    console.log(`Creating products for ${collectionSlug}...`);

    for (const [i, product] of products.entries()) {
      const slug = product.name
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_]+/g, "-")
        .replace(/^-+|-+$/g, "");

      // Insert product
      const { data: createdProduct, error: productErr } = await supabase
        .from("products")
        .upsert(
          {
            collection_id: collectionId,
            name: product.name,
            slug,
            description: product.description,
            price: product.price,
            compare_at_price: product.compare_at_price || null,
            material: product.material,
            care_instructions: product.care_instructions,
            country_of_origin: product.country_of_origin,
            is_active: true,
            is_featured: product.is_featured || false,
          },
          { onConflict: "slug" }
        )
        .select()
        .single();

      if (productErr || !createdProduct) {
        console.warn(`⚠ Skip product "${product.name}":`, productErr?.message);
        continue;
      }

      const productId = (createdProduct as any).id;

      // Insert images (using Unsplash URLs as placeholder)
      // Clear first to prevent duplicates (since storage_path has no DB unique constraint)
      await supabase.from("product_images").delete().eq("product_id", productId);
      
      await supabase.from("product_images").insert(
        [
          {
            product_id: productId,
            storage_path: `products/${productId}/primary.jpg`,
            public_url: getImage(totalProducts + i),
            alt_text: product.name,
            display_order: 0,
            is_primary: true,
          },
          {
            product_id: productId,
            storage_path: `products/${productId}/secondary.jpg`,
            public_url: getImage(totalProducts + i + 1),
            alt_text: `${product.name} - alternate view`,
            display_order: 1,
            is_primary: false,
          },
        ]
      );

      // Insert variants
      const sizes = product.sizes || ["XS", "S", "M", "L", "XL"];
      const variants = sizes.map((size: string, si: number) => ({
        product_id: productId,
        size,
        sku: `${slug.slice(0, 8).toUpperCase()}-${size}`,
        stock_quantity: Math.floor(Math.random() * 15) + 2, // 2-16 in stock
        is_available: true,
      }));

      await supabase.from("product_variants").upsert(variants, {
        onConflict: "sku",
      });

      process.stdout.write(`  ✓ ${product.name}\n`);
    }
    totalProducts += products.length;
    console.log();
  }

  console.log(`\n✅ Seed complete! Created ${totalProducts} products across 5 collections.`);
  console.log("\nNext steps:");
  console.log("1. Create a public Supabase Storage bucket named 'product-images'");
  console.log("2. Create an admin user via Supabase Auth → Users → Add User");
  console.log("3. Set your environment variables in .env.local");
  console.log("4. Run: npm run dev");
}

seed().catch(console.error);
