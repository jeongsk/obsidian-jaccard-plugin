This file is a merged representation of the entire codebase, combined into a single document by Repomix.
The content has been processed where security check has been disabled.

# File Summary

## Purpose
This file contains a packed representation of the entire repository's contents.
It is designed to be easily consumable by AI systems for analysis, code review,
or other automated processes.

## File Format
The content is organized as follows:
1. This summary section
2. Repository information
3. Directory structure
4. Repository files (if enabled)
5. Multiple file entries, each consisting of:
  a. A header with the file path (## File: path/to/file)
  b. The full contents of the file in a code block

## Usage Guidelines
- This file should be treated as read-only. Any changes should be made to the
  original repository files, not this packed version.
- When processing this file, use the file path to distinguish
  between different files in the repository.
- Be aware that this file may contain sensitive information. Handle it with
  the same level of security as you would the original repository.

## Notes
- Some files may have been excluded based on .gitignore rules and Repomix's configuration
- Binary files are not included in this packed representation. Please refer to the Repository Structure section for a complete list of file paths, including binary files
- Files matching patterns in .gitignore are excluded
- Files matching default ignore patterns are excluded
- Security check has been disabled - content may contain sensitive information
- Files are sorted by Git change count (files with more changes are at the bottom)

# Directory Structure
```
.github/
  workflows/
    ci.yml
src/
  main/
    scala/
      com/
        twitter/
          Regex.scala
      is/
        gregoirege/
          oktjs/
            Okt.scala
            Resources.scala
      org/
        openkoreantext/
          processor/
            util/
              CharArraySet.scala
              KoreanDictionaryProviderShim.scala
  index.js
.gitignore
.gitmodules
.npmignore
build.sbt
example.js
flake.lock
flake.nix
index.d.ts
LICENSE
package.json
README.md
resources.js
resources.json.gz.build.js
```

# Files

## File: .github/workflows/ci.yml
````yaml
name: CI

on:
  push:
    branches: [ master ]
  pull_request:
    branches: [ master ]

jobs:
  check:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3
        with:
          submodules: recursive

      - uses: actions/setup-node@v3
        with:
          node-version: 16
          cache: yarn
          registry-url: 'https://registry.npmjs.org'

      - uses: actions/setup-java@v3
        with:
          distribution: temurin
          java-version: 8

      - name: Install dependencies
        run: yarn install --frozen-lockfile

      - name: Build package
        run: yarn run build

      - name: Run tests
        run: yarn run test

      - name: Create tag based on package.json
        uses: butlerlogic/action-autotag@ade8d2e19bfcd1e6a91272e2849b4bf4c37a67f1
        if: ${{ github.event_name == 'push' }}
        id: autotag
        with:
          tag_prefix: v
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}

      - name: Publish to NPM
        run: yarn publish
        if: ${{ steps.autotag.outputs.tagcreated == 'yes' }}
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
````

## File: src/main/scala/com/twitter/Regex.scala
````scala
// Copyright 2018 Twitter, Inc.
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0
package com.twitter

// Twitter Regex patterns used in OKT. Evaluated in Java from
// https://github.com/twitter/twitter-text/blob/30e2430d90cff3b46393ea54caf511441983c260/java/src/main/java/com/twitter/twittertext/Regex.java
// then written to this class. \p{InGeneralPunctuation} was replaced by
// \u2000-\u206f as per https://unicode.org/charts/PDF/U2000.pdf.
object Regex {
  val VALID_URL =
    """(?i)(((?:[^a-z0-9@＠$#＃\uFFFE\uFEFF\uFFFF]|[\u061C\u200E\u200F\u202A\u202B\u202C\u202D\u202E\u2066\u2067\u2068\u2069]|^))((https?://)?((?:(?>(?:[a-z0-9\u00c0-\u00d6\u00d8-\u00f6\u00f8-\u00ff\u0100-\u024f\u0253\u0254\u0256\u0257\u0259\u025b\u0263\u0268\u026f\u0272\u0289\u028b\u02bb\u0300-\u036f\u1e00-\u1eff][[a-z0-9\u00c0-\u00d6\u00d8-\u00f6\u00f8-\u00ff\u0100-\u024f\u0253\u0254\u0256\u0257\u0259\u025b\u0263\u0268\u026f\u0272\u0289\u028b\u02bb\u0300-\u036f\u1e00-\u1eff]\-_]*)?[a-z0-9\u00c0-\u00d6\u00d8-\u00f6\u00f8-\u00ff\u0100-\u024f\u0253\u0254\u0256\u0257\u0259\u025b\u0263\u0268\u026f\u0272\u0289\u028b\u02bb\u0300-\u036f\u1e00-\u1eff]\.)*(?:(?:[a-z0-9\u00c0-\u00d6\u00d8-\u00f6\u00f8-\u00ff\u0100-\u024f\u0253\u0254\u0256\u0257\u0259\u025b\u0263\u0268\u026f\u0272\u0289\u028b\u02bb\u0300-\u036f\u1e00-\u1eff][[a-z0-9\u00c0-\u00d6\u00d8-\u00f6\u00f8-\u00ff\u0100-\u024f\u0253\u0254\u0256\u0257\u0259\u025b\u0263\u0268\u026f\u0272\u0289\u028b\u02bb\u0300-\u036f\u1e00-\u1eff]\-]*)?[a-z0-9\u00c0-\u00d6\u00d8-\u00f6\u00f8-\u00ff\u0100-\u024f\u0253\u0254\u0256\u0257\u0259\u025b\u0263\u0268\u026f\u0272\u0289\u028b\u02bb\u0300-\u036f\u1e00-\u1eff]\.)(?:(?:(?:삼성|닷컴|닷넷|香格里拉|餐厅|食品|飞利浦|電訊盈科|集团|通販|购物|谷歌|诺基亚|联通|网络|网站|网店|网址|组织机构|移动|珠宝|点看|游戏|淡马锡|机构|書籍|时尚|新闻|政府|政务|招聘|手表|手机|我爱你|慈善|微博|广东|工行|家電|娱乐|天主教|大拿|大众汽车|在线|嘉里大酒店|嘉里|商标|商店|商城|公益|公司|八卦|健康|信息|佛山|企业|中文网|中信|世界|ポイント|ファッション|セール|ストア|コム|グーグル|クラウド|みんな|คอม|संगठन|नेट|कॉम|همراه|موقع|موبايلي|كوم|كاثوليك|عرب|شبكة|بيتك|بازار|العليان|ارامكو|اتصالات|ابوظبي|קום|сайт|рус|орг|онлайн|москва|ком|католик|дети|zuerich|zone|zippo|zip|zero|zara|zappos|yun|youtube|you|yokohama|yoga|yodobashi|yandex|yamaxun|yahoo|yachts|xyz|xxx|xperia|xin|xihuan|xfinity|xerox|xbox|wtf|wtc|wow|world|works|work|woodside|wolterskluwer|wme|winners|wine|windows|win|williamhill|wiki|wien|whoswho|weir|weibo|wedding|wed|website|weber|webcam|weatherchannel|weather|watches|watch|warman|wanggou|wang|walter|walmart|wales|vuelos|voyage|voto|voting|vote|volvo|volkswagen|vodka|vlaanderen|vivo|viva|vistaprint|vista|vision|visa|virgin|vip|vin|villas|viking|vig|video|viajes|vet|versicherung|vermögensberatung|vermögensberater|verisign|ventures|vegas|vanguard|vana|vacations|ups|uol|uno|university|unicom|uconnect|ubs|ubank|tvs|tushu|tunes|tui|tube|trv|trust|travelersinsurance|travelers|travelchannel|travel|training|trading|trade|toys|toyota|town|tours|total|toshiba|toray|top|tools|tokyo|today|tmall|tkmaxx|tjx|tjmaxx|tirol|tires|tips|tiffany|tienda|tickets|tiaa|theatre|theater|thd|teva|tennis|temasek|telefonica|telecity|tel|technology|tech|team|tdk|tci|taxi|tax|tattoo|tatar|tatamotors|target|taobao|talk|taipei|tab|systems|symantec|sydney|swiss|swiftcover|swatch|suzuki|surgery|surf|support|supply|supplies|sucks|style|study|studio|stream|store|storage|stockholm|stcgroup|stc|statoil|statefarm|statebank|starhub|star|staples|stada|srt|srl|spreadbetting|spot|sport|spiegel|space|soy|sony|song|solutions|solar|sohu|software|softbank|social|soccer|sncf|smile|smart|sling|skype|sky|skin|ski|site|singles|sina|silk|shriram|showtime|show|shouji|shopping|shop|shoes|shiksha|shia|shell|shaw|sharp|shangrila|sfr|sexy|sex|sew|seven|ses|services|sener|select|seek|security|secure|seat|search|scot|scor|scjohnson|science|schwarz|schule|school|scholarships|schmidt|schaeffler|scb|sca|sbs|sbi|saxo|save|sas|sarl|sapo|sap|sanofi|sandvikcoromant|sandvik|samsung|samsclub|salon|sale|sakura|safety|safe|saarland|ryukyu|rwe|run|ruhr|rugby|rsvp|room|rogers|rodeo|rocks|rocher|rmit|rip|rio|ril|rightathome|ricoh|richardli|rich|rexroth|reviews|review|restaurant|rest|republican|report|repair|rentals|rent|ren|reliance|reit|reisen|reise|rehab|redumbrella|redstone|red|recipes|realty|realtor|realestate|read|raid|radio|racing|qvc|quest|quebec|qpon|pwc|pub|prudential|pru|protection|property|properties|promo|progressive|prof|productions|prod|pro|prime|press|praxi|pramerica|post|porn|politie|poker|pohl|pnc|plus|plumbing|playstation|play|place|pizza|pioneer|pink|ping|pin|pid|pictures|pictet|pics|piaget|physio|photos|photography|photo|phone|philips|phd|pharmacy|pfizer|pet|pccw|pay|passagens|party|parts|partners|pars|paris|panerai|panasonic|pamperedchef|page|ovh|ott|otsuka|osaka|origins|orientexpress|organic|org|orange|oracle|open|ooo|onyourside|online|onl|ong|one|omega|ollo|oldnavy|olayangroup|olayan|okinawa|office|off|observer|obi|nyc|ntt|nrw|nra|nowtv|nowruz|now|norton|northwesternmutual|nokia|nissay|nissan|ninja|nikon|nike|nico|nhk|ngo|nfl|nexus|nextdirect|next|news|newholland|new|neustar|network|netflix|netbank|net|nec|nba|navy|natura|nationwide|name|nagoya|nadex|nab|mutuelle|mutual|museum|mtr|mtpc|mtn|msd|movistar|movie|mov|motorcycles|moto|moscow|mortgage|mormon|mopar|montblanc|monster|money|monash|mom|moi|moe|moda|mobily|mobile|mobi|mma|mls|mlb|mitsubishi|mit|mint|mini|mil|microsoft|miami|metlife|merckmsd|meo|menu|men|memorial|meme|melbourne|meet|media|med|mckinsey|mcdonalds|mcd|mba|mattel|maserati|marshalls|marriott|markets|marketing|market|map|mango|management|man|makeup|maison|maif|madrid|macys|luxury|luxe|lupin|lundbeck|ltda|ltd|lplfinancial|lpl|love|lotto|lotte|london|lol|loft|locus|locker|loans|loan|llp|llc|lixil|living|live|lipsy|link|linde|lincoln|limo|limited|lilly|like|lighting|lifestyle|lifeinsurance|life|lidl|liaison|lgbt|lexus|lego|legal|lefrak|leclerc|lease|lds|lawyer|law|latrobe|latino|lat|lasalle|lanxess|landrover|land|lancome|lancia|lancaster|lamer|lamborghini|ladbrokes|lacaixa|kyoto|kuokgroup|kred|krd|kpn|kpmg|kosher|komatsu|koeln|kiwi|kitchen|kindle|kinder|kim|kia|kfh|kerryproperties|kerrylogistics|kerryhotels|kddi|kaufen|juniper|juegos|jprs|jpmorgan|joy|jot|joburg|jobs|jnj|jmp|jll|jlc|jio|jewelry|jetzt|jeep|jcp|jcb|java|jaguar|iwc|iveco|itv|itau|istanbul|ist|ismaili|iselect|irish|ipiranga|investments|intuit|international|intel|int|insure|insurance|institute|ink|ing|info|infiniti|industries|inc|immobilien|immo|imdb|imamat|ikano|iinet|ifm|ieee|icu|ice|icbc|ibm|hyundai|hyatt|hughes|htc|hsbc|how|house|hotmail|hotels|hoteles|hot|hosting|host|hospital|horse|honeywell|honda|homesense|homes|homegoods|homedepot|holiday|holdings|hockey|hkt|hiv|hitachi|hisamitsu|hiphop|hgtv|hermes|here|helsinki|help|healthcare|health|hdfcbank|hdfc|hbo|haus|hangout|hamburg|hair|guru|guitars|guide|guge|gucci|guardian|group|grocery|gripe|green|gratis|graphics|grainger|gov|got|gop|google|goog|goodyear|goodhands|goo|golf|goldpoint|gold|godaddy|gmx|gmo|gmbh|gmail|globo|global|gle|glass|glade|giving|gives|gifts|gift|ggee|george|genting|gent|gea|gdn|gbiz|gay|garden|gap|games|game|gallup|gallo|gallery|gal|fyi|futbol|furniture|fund|fun|fujixerox|fujitsu|ftr|frontier|frontdoor|frogans|frl|fresenius|free|fox|foundation|forum|forsale|forex|ford|football|foodnetwork|food|foo|fly|flsmidth|flowers|florist|flir|flights|flickr|fitness|fit|fishing|fish|firmdale|firestone|fire|financial|finance|final|film|fido|fidelity|fiat|ferrero|ferrari|feedback|fedex|fast|fashion|farmers|farm|fans|fan|family|faith|fairwinds|fail|fage|extraspace|express|exposed|expert|exchange|everbank|events|eus|eurovision|etisalat|esurance|estate|esq|erni|ericsson|equipment|epson|epost|enterprises|engineering|engineer|energy|emerck|email|education|edu|edeka|eco|eat|earth|dvr|dvag|durban|dupont|duns|dunlop|duck|dubai|dtv|drive|download|dot|doosan|domains|doha|dog|dodge|doctor|docs|dnp|diy|dish|discover|discount|directory|direct|digital|diet|diamonds|dhl|dev|design|desi|dentist|dental|democrat|delta|deloitte|dell|delivery|degree|deals|dealer|deal|dds|dclk|day|datsun|dating|date|data|dance|dad|dabur|cyou|cymru|cuisinella|csc|cruises|cruise|crs|crown|cricket|creditunion|creditcard|credit|cpa|courses|coupons|coupon|country|corsica|coop|cool|cookingchannel|cooking|contractors|contact|consulting|construction|condos|comsec|computer|compare|company|community|commbank|comcast|com|cologne|college|coffee|codes|coach|clubmed|club|cloud|clothing|clinique|clinic|click|cleaning|claims|cityeats|city|citic|citi|citadel|cisco|circle|cipriani|church|chrysler|chrome|christmas|chloe|chintai|cheap|chat|chase|charity|channel|chanel|cfd|cfa|cern|ceo|center|ceb|cbs|cbre|cbn|cba|catholic|catering|cat|casino|cash|caseih|case|casa|cartier|cars|careers|career|care|cards|caravan|car|capitalone|capital|capetown|canon|cancerresearch|camp|camera|cam|calvinklein|call|cal|cafe|cab|bzh|buzz|buy|business|builders|build|bugatti|budapest|brussels|brother|broker|broadway|bridgestone|bradesco|box|boutique|bot|boston|bostik|bosch|boots|booking|book|boo|bond|bom|bofa|boehringer|boats|bnpparibas|bnl|bmw|bms|blue|bloomberg|blog|blockbuster|blanco|blackfriday|black|biz|bio|bingo|bing|bike|bid|bible|bharti|bet|bestbuy|best|berlin|bentley|beer|beauty|beats|bcn|bcg|bbva|bbt|bbc|bayern|bauhaus|basketball|baseball|bargains|barefoot|barclays|barclaycard|barcelona|bar|bank|band|bananarepublic|banamex|baidu|baby|azure|axa|aws|avianca|autos|auto|author|auspost|audio|audible|audi|auction|attorney|athleta|associates|asia|asda|arte|art|arpa|army|archi|aramco|arab|aquarelle|apple|app|apartments|aol|anz|anquan|android|analytics|amsterdam|amica|amfam|amex|americanfamily|americanexpress|alstom|alsace|ally|allstate|allfinanz|alipay|alibaba|alfaromeo|akdn|airtel|airforce|airbus|aigo|aig|agency|agakhan|africa|afl|afamilycompany|aetna|aero|aeg|adult|ads|adac|actor|active|aco|accountants|accountant|accenture|academy|abudhabi|abogado|able|abc|abbvie|abbott|abb|abarth|aarp|aaa|onion)(?=[^a-z0-9@+-]|$))|(?:(?:한국|香港|澳門|新加坡|台灣|台湾|中國|中国|გე|ລາວ|ไทย|ලංකා|ഭാരതം|ಭಾರತ|భారత్|சிங்கப்பூர்|இலங்கை|இந்தியா|ଭାରତ|ભારત|ਭਾਰਤ|ভাৰত|ভারত|বাংলা|भारोत|भारतम्|भारत|ڀارت|پاکستان|موريتانيا|مليسيا|مصر|قطر|فلسطين|عمان|عراق|سورية|سودان|تونس|بھارت|بارت|ایران|امارات|المغرب|السعودية|الجزائر|البحرين|الاردن|հայ|қаз|укр|срб|рф|мон|мкд|ею|бел|бг|ευ|ελ|zw|zm|za|yt|ye|ws|wf|vu|vn|vi|vg|ve|vc|va|uz|uy|us|um|uk|ug|ua|tz|tw|tv|tt|tr|tp|to|tn|tm|tl|tk|tj|th|tg|tf|td|tc|sz|sy|sx|sv|su|st|ss|sr|so|sn|sm|sl|sk|sj|si|sh|sg|se|sd|sc|sb|sa|rw|ru|rs|ro|re|qa|py|pw|pt|ps|pr|pn|pm|pl|pk|ph|pg|pf|pe|pa|om|nz|nu|nr|np|no|nl|ni|ng|nf|ne|nc|na|mz|my|mx|mw|mv|mu|mt|ms|mr|mq|mp|mo|mn|mm|ml|mk|mh|mg|mf|me|md|mc|ma|ly|lv|lu|lt|ls|lr|lk|li|lc|lb|la|kz|ky|kw|kr|kp|kn|km|ki|kh|kg|ke|jp|jo|jm|je|it|is|ir|iq|io|in|im|il|ie|id|hu|ht|hr|hn|hm|hk|gy|gw|gu|gt|gs|gr|gq|gp|gn|gm|gl|gi|gh|gg|gf|ge|gd|gb|ga|fr|fo|fm|fk|fj|fi|eu|et|es|er|eh|eg|ee|ec|dz|do|dm|dk|dj|de|cz|cy|cx|cw|cv|cu|cr|co|cn|cm|cl|ck|ci|ch|cg|cf|cd|cc|ca|bz|by|bw|bv|bt|bs|br|bq|bo|bn|bm|bl|bj|bi|bh|bg|bf|be|bd|bb|ba|az|ax|aw|au|at|as|ar|aq|ao|an|am|al|ai|ag|af|ae|ad|ac)(?=[^a-z0-9@+-]|$))|(?:xn--[-0-9a-z]+)))|(?:(?<=https?://)(?:(?:(?:(?:[a-z0-9\u00c0-\u00d6\u00d8-\u00f6\u00f8-\u00ff\u0100-\u024f\u0253\u0254\u0256\u0257\u0259\u025b\u0263\u0268\u026f\u0272\u0289\u028b\u02bb\u0300-\u036f\u1e00-\u1eff][[a-z0-9\u00c0-\u00d6\u00d8-\u00f6\u00f8-\u00ff\u0100-\u024f\u0253\u0254\u0256\u0257\u0259\u025b\u0263\u0268\u026f\u0272\u0289\u028b\u02bb\u0300-\u036f\u1e00-\u1eff]\-]*)?[a-z0-9\u00c0-\u00d6\u00d8-\u00f6\u00f8-\u00ff\u0100-\u024f\u0253\u0254\u0256\u0257\u0259\u025b\u0263\u0268\u026f\u0272\u0289\u028b\u02bb\u0300-\u036f\u1e00-\u1eff]\.)(?:(?:한국|香港|澳門|新加坡|台灣|台湾|中國|中国|გე|ລາວ|ไทย|ලංකා|ഭാരതം|ಭಾರತ|భారత్|சிங்கப்பூர்|இலங்கை|இந்தியா|ଭାରତ|ભારત|ਭਾਰਤ|ভাৰত|ভারত|বাংলা|भारोत|भारतम्|भारत|ڀارت|پاکستان|موريتانيا|مليسيا|مصر|قطر|فلسطين|عمان|عراق|سورية|سودان|تونس|بھارت|بارت|ایران|امارات|المغرب|السعودية|الجزائر|البحرين|الاردن|հայ|қаз|укр|срб|рф|мон|мкд|ею|бел|бг|ευ|ελ|zw|zm|za|yt|ye|ws|wf|vu|vn|vi|vg|ve|vc|va|uz|uy|us|um|uk|ug|ua|tz|tw|tv|tt|tr|tp|to|tn|tm|tl|tk|tj|th|tg|tf|td|tc|sz|sy|sx|sv|su|st|ss|sr|so|sn|sm|sl|sk|sj|si|sh|sg|se|sd|sc|sb|sa|rw|ru|rs|ro|re|qa|py|pw|pt|ps|pr|pn|pm|pl|pk|ph|pg|pf|pe|pa|om|nz|nu|nr|np|no|nl|ni|ng|nf|ne|nc|na|mz|my|mx|mw|mv|mu|mt|ms|mr|mq|mp|mo|mn|mm|ml|mk|mh|mg|mf|me|md|mc|ma|ly|lv|lu|lt|ls|lr|lk|li|lc|lb|la|kz|ky|kw|kr|kp|kn|km|ki|kh|kg|ke|jp|jo|jm|je|it|is|ir|iq|io|in|im|il|ie|id|hu|ht|hr|hn|hm|hk|gy|gw|gu|gt|gs|gr|gq|gp|gn|gm|gl|gi|gh|gg|gf|ge|gd|gb|ga|fr|fo|fm|fk|fj|fi|eu|et|es|er|eh|eg|ee|ec|dz|do|dm|dk|dj|de|cz|cy|cx|cw|cv|cu|cr|co|cn|cm|cl|ck|ci|ch|cg|cf|cd|cc|ca|bz|by|bw|bv|bt|bs|br|bq|bo|bn|bm|bl|bj|bi|bh|bg|bf|be|bd|bb|ba|az|ax|aw|au|at|as|ar|aq|ao|an|am|al|ai|ag|af|ae|ad|ac)(?=[^a-z0-9@+-]|$)))|(?:(?:(?:[^-_!"#$%&'\(\)*+,./:;<=>?@\[\]^`\{|}~\s\p{Z}\u2000-\u206f][[^-_!"#$%&'\(\)*+,./:;<=>?@\[\]^`\{|}~\s\p{Z}\u2000-\u206f]\-]*)?[^-_!"#$%&'\(\)*+,./:;<=>?@\[\]^`\{|}~\s\p{Z}\u2000-\u206f]\.)(?:(?:(?:삼성|닷컴|닷넷|香格里拉|餐厅|食品|飞利浦|電訊盈科|集团|通販|购物|谷歌|诺基亚|联通|网络|网站|网店|网址|组织机构|移动|珠宝|点看|游戏|淡马锡|机构|書籍|时尚|新闻|政府|政务|招聘|手表|手机|我爱你|慈善|微博|广东|工行|家電|娱乐|天主教|大拿|大众汽车|在线|嘉里大酒店|嘉里|商标|商店|商城|公益|公司|八卦|健康|信息|佛山|企业|中文网|中信|世界|ポイント|ファッション|セール|ストア|コム|グーグル|クラウド|みんな|คอม|संगठन|नेट|कॉम|همراه|موقع|موبايلي|كوم|كاثوليك|عرب|شبكة|بيتك|بازار|العليان|ارامكو|اتصالات|ابوظبي|קום|сайт|рус|орг|онлайн|москва|ком|католик|дети|zuerich|zone|zippo|zip|zero|zara|zappos|yun|youtube|you|yokohama|yoga|yodobashi|yandex|yamaxun|yahoo|yachts|xyz|xxx|xperia|xin|xihuan|xfinity|xerox|xbox|wtf|wtc|wow|world|works|work|woodside|wolterskluwer|wme|winners|wine|windows|win|williamhill|wiki|wien|whoswho|weir|weibo|wedding|wed|website|weber|webcam|weatherchannel|weather|watches|watch|warman|wanggou|wang|walter|walmart|wales|vuelos|voyage|voto|voting|vote|volvo|volkswagen|vodka|vlaanderen|vivo|viva|vistaprint|vista|vision|visa|virgin|vip|vin|villas|viking|vig|video|viajes|vet|versicherung|vermögensberatung|vermögensberater|verisign|ventures|vegas|vanguard|vana|vacations|ups|uol|uno|university|unicom|uconnect|ubs|ubank|tvs|tushu|tunes|tui|tube|trv|trust|travelersinsurance|travelers|travelchannel|travel|training|trading|trade|toys|toyota|town|tours|total|toshiba|toray|top|tools|tokyo|today|tmall|tkmaxx|tjx|tjmaxx|tirol|tires|tips|tiffany|tienda|tickets|tiaa|theatre|theater|thd|teva|tennis|temasek|telefonica|telecity|tel|technology|tech|team|tdk|tci|taxi|tax|tattoo|tatar|tatamotors|target|taobao|talk|taipei|tab|systems|symantec|sydney|swiss|swiftcover|swatch|suzuki|surgery|surf|support|supply|supplies|sucks|style|study|studio|stream|store|storage|stockholm|stcgroup|stc|statoil|statefarm|statebank|starhub|star|staples|stada|srt|srl|spreadbetting|spot|sport|spiegel|space|soy|sony|song|solutions|solar|sohu|software|softbank|social|soccer|sncf|smile|smart|sling|skype|sky|skin|ski|site|singles|sina|silk|shriram|showtime|show|shouji|shopping|shop|shoes|shiksha|shia|shell|shaw|sharp|shangrila|sfr|sexy|sex|sew|seven|ses|services|sener|select|seek|security|secure|seat|search|scot|scor|scjohnson|science|schwarz|schule|school|scholarships|schmidt|schaeffler|scb|sca|sbs|sbi|saxo|save|sas|sarl|sapo|sap|sanofi|sandvikcoromant|sandvik|samsung|samsclub|salon|sale|sakura|safety|safe|saarland|ryukyu|rwe|run|ruhr|rugby|rsvp|room|rogers|rodeo|rocks|rocher|rmit|rip|rio|ril|rightathome|ricoh|richardli|rich|rexroth|reviews|review|restaurant|rest|republican|report|repair|rentals|rent|ren|reliance|reit|reisen|reise|rehab|redumbrella|redstone|red|recipes|realty|realtor|realestate|read|raid|radio|racing|qvc|quest|quebec|qpon|pwc|pub|prudential|pru|protection|property|properties|promo|progressive|prof|productions|prod|pro|prime|press|praxi|pramerica|post|porn|politie|poker|pohl|pnc|plus|plumbing|playstation|play|place|pizza|pioneer|pink|ping|pin|pid|pictures|pictet|pics|piaget|physio|photos|photography|photo|phone|philips|phd|pharmacy|pfizer|pet|pccw|pay|passagens|party|parts|partners|pars|paris|panerai|panasonic|pamperedchef|page|ovh|ott|otsuka|osaka|origins|orientexpress|organic|org|orange|oracle|open|ooo|onyourside|online|onl|ong|one|omega|ollo|oldnavy|olayangroup|olayan|okinawa|office|off|observer|obi|nyc|ntt|nrw|nra|nowtv|nowruz|now|norton|northwesternmutual|nokia|nissay|nissan|ninja|nikon|nike|nico|nhk|ngo|nfl|nexus|nextdirect|next|news|newholland|new|neustar|network|netflix|netbank|net|nec|nba|navy|natura|nationwide|name|nagoya|nadex|nab|mutuelle|mutual|museum|mtr|mtpc|mtn|msd|movistar|movie|mov|motorcycles|moto|moscow|mortgage|mormon|mopar|montblanc|monster|money|monash|mom|moi|moe|moda|mobily|mobile|mobi|mma|mls|mlb|mitsubishi|mit|mint|mini|mil|microsoft|miami|metlife|merckmsd|meo|menu|men|memorial|meme|melbourne|meet|media|med|mckinsey|mcdonalds|mcd|mba|mattel|maserati|marshalls|marriott|markets|marketing|market|map|mango|management|man|makeup|maison|maif|madrid|macys|luxury|luxe|lupin|lundbeck|ltda|ltd|lplfinancial|lpl|love|lotto|lotte|london|lol|loft|locus|locker|loans|loan|llp|llc|lixil|living|live|lipsy|link|linde|lincoln|limo|limited|lilly|like|lighting|lifestyle|lifeinsurance|life|lidl|liaison|lgbt|lexus|lego|legal|lefrak|leclerc|lease|lds|lawyer|law|latrobe|latino|lat|lasalle|lanxess|landrover|land|lancome|lancia|lancaster|lamer|lamborghini|ladbrokes|lacaixa|kyoto|kuokgroup|kred|krd|kpn|kpmg|kosher|komatsu|koeln|kiwi|kitchen|kindle|kinder|kim|kia|kfh|kerryproperties|kerrylogistics|kerryhotels|kddi|kaufen|juniper|juegos|jprs|jpmorgan|joy|jot|joburg|jobs|jnj|jmp|jll|jlc|jio|jewelry|jetzt|jeep|jcp|jcb|java|jaguar|iwc|iveco|itv|itau|istanbul|ist|ismaili|iselect|irish|ipiranga|investments|intuit|international|intel|int|insure|insurance|institute|ink|ing|info|infiniti|industries|inc|immobilien|immo|imdb|imamat|ikano|iinet|ifm|ieee|icu|ice|icbc|ibm|hyundai|hyatt|hughes|htc|hsbc|how|house|hotmail|hotels|hoteles|hot|hosting|host|hospital|horse|honeywell|honda|homesense|homes|homegoods|homedepot|holiday|holdings|hockey|hkt|hiv|hitachi|hisamitsu|hiphop|hgtv|hermes|here|helsinki|help|healthcare|health|hdfcbank|hdfc|hbo|haus|hangout|hamburg|hair|guru|guitars|guide|guge|gucci|guardian|group|grocery|gripe|green|gratis|graphics|grainger|gov|got|gop|google|goog|goodyear|goodhands|goo|golf|goldpoint|gold|godaddy|gmx|gmo|gmbh|gmail|globo|global|gle|glass|glade|giving|gives|gifts|gift|ggee|george|genting|gent|gea|gdn|gbiz|gay|garden|gap|games|game|gallup|gallo|gallery|gal|fyi|futbol|furniture|fund|fun|fujixerox|fujitsu|ftr|frontier|frontdoor|frogans|frl|fresenius|free|fox|foundation|forum|forsale|forex|ford|football|foodnetwork|food|foo|fly|flsmidth|flowers|florist|flir|flights|flickr|fitness|fit|fishing|fish|firmdale|firestone|fire|financial|finance|final|film|fido|fidelity|fiat|ferrero|ferrari|feedback|fedex|fast|fashion|farmers|farm|fans|fan|family|faith|fairwinds|fail|fage|extraspace|express|exposed|expert|exchange|everbank|events|eus|eurovision|etisalat|esurance|estate|esq|erni|ericsson|equipment|epson|epost|enterprises|engineering|engineer|energy|emerck|email|education|edu|edeka|eco|eat|earth|dvr|dvag|durban|dupont|duns|dunlop|duck|dubai|dtv|drive|download|dot|doosan|domains|doha|dog|dodge|doctor|docs|dnp|diy|dish|discover|discount|directory|direct|digital|diet|diamonds|dhl|dev|design|desi|dentist|dental|democrat|delta|deloitte|dell|delivery|degree|deals|dealer|deal|dds|dclk|day|datsun|dating|date|data|dance|dad|dabur|cyou|cymru|cuisinella|csc|cruises|cruise|crs|crown|cricket|creditunion|creditcard|credit|cpa|courses|coupons|coupon|country|corsica|coop|cool|cookingchannel|cooking|contractors|contact|consulting|construction|condos|comsec|computer|compare|company|community|commbank|comcast|com|cologne|college|coffee|codes|coach|clubmed|club|cloud|clothing|clinique|clinic|click|cleaning|claims|cityeats|city|citic|citi|citadel|cisco|circle|cipriani|church|chrysler|chrome|christmas|chloe|chintai|cheap|chat|chase|charity|channel|chanel|cfd|cfa|cern|ceo|center|ceb|cbs|cbre|cbn|cba|catholic|catering|cat|casino|cash|caseih|case|casa|cartier|cars|careers|career|care|cards|caravan|car|capitalone|capital|capetown|canon|cancerresearch|camp|camera|cam|calvinklein|call|cal|cafe|cab|bzh|buzz|buy|business|builders|build|bugatti|budapest|brussels|brother|broker|broadway|bridgestone|bradesco|box|boutique|bot|boston|bostik|bosch|boots|booking|book|boo|bond|bom|bofa|boehringer|boats|bnpparibas|bnl|bmw|bms|blue|bloomberg|blog|blockbuster|blanco|blackfriday|black|biz|bio|bingo|bing|bike|bid|bible|bharti|bet|bestbuy|best|berlin|bentley|beer|beauty|beats|bcn|bcg|bbva|bbt|bbc|bayern|bauhaus|basketball|baseball|bargains|barefoot|barclays|barclaycard|barcelona|bar|bank|band|bananarepublic|banamex|baidu|baby|azure|axa|aws|avianca|autos|auto|author|auspost|audio|audible|audi|auction|attorney|athleta|associates|asia|asda|arte|art|arpa|army|archi|aramco|arab|aquarelle|apple|app|apartments|aol|anz|anquan|android|analytics|amsterdam|amica|amfam|amex|americanfamily|americanexpress|alstom|alsace|ally|allstate|allfinanz|alipay|alibaba|alfaromeo|akdn|airtel|airforce|airbus|aigo|aig|agency|agakhan|africa|afl|afamilycompany|aetna|aero|aeg|adult|ads|adac|actor|active|aco|accountants|accountant|accenture|academy|abudhabi|abogado|able|abc|abbvie|abbott|abb|abarth|aarp|aaa|onion)(?=[^a-z0-9@+-]|$))|(?:(?:한국|香港|澳門|新加坡|台灣|台湾|中國|中国|გე|ລາວ|ไทย|ලංකා|ഭാരതം|ಭಾರತ|భారత్|சிங்கப்பூர்|இலங்கை|இந்தியா|ଭାରତ|ભારત|ਭਾਰਤ|ভাৰত|ভারত|বাংলা|भारोत|भारतम्|भारत|ڀارت|پاکستان|موريتانيا|مليسيا|مصر|قطر|فلسطين|عمان|عراق|سورية|سودان|تونس|بھارت|بارت|ایران|امارات|المغرب|السعودية|الجزائر|البحرين|الاردن|հայ|қаз|укр|срб|рф|мон|мкд|ею|бел|бг|ευ|ελ|zw|zm|za|yt|ye|ws|wf|vu|vn|vi|vg|ve|vc|va|uz|uy|us|um|uk|ug|ua|tz|tw|tv|tt|tr|tp|to|tn|tm|tl|tk|tj|th|tg|tf|td|tc|sz|sy|sx|sv|su|st|ss|sr|so|sn|sm|sl|sk|sj|si|sh|sg|se|sd|sc|sb|sa|rw|ru|rs|ro|re|qa|py|pw|pt|ps|pr|pn|pm|pl|pk|ph|pg|pf|pe|pa|om|nz|nu|nr|np|no|nl|ni|ng|nf|ne|nc|na|mz|my|mx|mw|mv|mu|mt|ms|mr|mq|mp|mo|mn|mm|ml|mk|mh|mg|mf|me|md|mc|ma|ly|lv|lu|lt|ls|lr|lk|li|lc|lb|la|kz|ky|kw|kr|kp|kn|km|ki|kh|kg|ke|jp|jo|jm|je|it|is|ir|iq|io|in|im|il|ie|id|hu|ht|hr|hn|hm|hk|gy|gw|gu|gt|gs|gr|gq|gp|gn|gm|gl|gi|gh|gg|gf|ge|gd|gb|ga|fr|fo|fm|fk|fj|fi|eu|et|es|er|eh|eg|ee|ec|dz|do|dm|dk|dj|de|cz|cy|cx|cw|cv|cu|cr|co|cn|cm|cl|ck|ci|ch|cg|cf|cd|cc|ca|bz|by|bw|bv|bt|bs|br|bq|bo|bn|bm|bl|bj|bi|bh|bg|bf|be|bd|bb|ba|az|ax|aw|au|at|as|ar|aq|ao|an|am|al|ai|ag|af|ae|ad|ac)(?=[^a-z0-9@+-]|$))))))|(?:(?:(?:[a-z0-9\u00c0-\u00d6\u00d8-\u00f6\u00f8-\u00ff\u0100-\u024f\u0253\u0254\u0256\u0257\u0259\u025b\u0263\u0268\u026f\u0272\u0289\u028b\u02bb\u0300-\u036f\u1e00-\u1eff][[a-z0-9\u00c0-\u00d6\u00d8-\u00f6\u00f8-\u00ff\u0100-\u024f\u0253\u0254\u0256\u0257\u0259\u025b\u0263\u0268\u026f\u0272\u0289\u028b\u02bb\u0300-\u036f\u1e00-\u1eff]\-]*)?[a-z0-9\u00c0-\u00d6\u00d8-\u00f6\u00f8-\u00ff\u0100-\u024f\u0253\u0254\u0256\u0257\u0259\u025b\u0263\u0268\u026f\u0272\u0289\u028b\u02bb\u0300-\u036f\u1e00-\u1eff]\.)(?:(?:한국|香港|澳門|新加坡|台灣|台湾|中國|中国|გე|ລາວ|ไทย|ලංකා|ഭാരതം|ಭಾರತ|భారత్|சிங்கப்பூர்|இலங்கை|இந்தியா|ଭାରତ|ભારત|ਭਾਰਤ|ভাৰত|ভারত|বাংলা|भारोत|भारतम्|भारत|ڀارت|پاکستان|موريتانيا|مليسيا|مصر|قطر|فلسطين|عمان|عراق|سورية|سودان|تونس|بھارت|بارت|ایران|امارات|المغرب|السعودية|الجزائر|البحرين|الاردن|հայ|қаз|укр|срб|рф|мон|мкд|ею|бел|бг|ευ|ελ|zw|zm|za|yt|ye|ws|wf|vu|vn|vi|vg|ve|vc|va|uz|uy|us|um|uk|ug|ua|tz|tw|tv|tt|tr|tp|to|tn|tm|tl|tk|tj|th|tg|tf|td|tc|sz|sy|sx|sv|su|st|ss|sr|so|sn|sm|sl|sk|sj|si|sh|sg|se|sd|sc|sb|sa|rw|ru|rs|ro|re|qa|py|pw|pt|ps|pr|pn|pm|pl|pk|ph|pg|pf|pe|pa|om|nz|nu|nr|np|no|nl|ni|ng|nf|ne|nc|na|mz|my|mx|mw|mv|mu|mt|ms|mr|mq|mp|mo|mn|mm|ml|mk|mh|mg|mf|me|md|mc|ma|ly|lv|lu|lt|ls|lr|lk|li|lc|lb|la|kz|ky|kw|kr|kp|kn|km|ki|kh|kg|ke|jp|jo|jm|je|it|is|ir|iq|io|in|im|il|ie|id|hu|ht|hr|hn|hm|hk|gy|gw|gu|gt|gs|gr|gq|gp|gn|gm|gl|gi|gh|gg|gf|ge|gd|gb|ga|fr|fo|fm|fk|fj|fi|eu|et|es|er|eh|eg|ee|ec|dz|do|dm|dk|dj|de|cz|cy|cx|cw|cv|cu|cr|co|cn|cm|cl|ck|ci|ch|cg|cf|cd|cc|ca|bz|by|bw|bv|bt|bs|br|bq|bo|bn|bm|bl|bj|bi|bh|bg|bf|be|bd|bb|ba|az|ax|aw|au|at|as|ar|aq|ao|an|am|al|ai|ag|af|ae|ad|ac)(?=[^a-z0-9@+-]|$))(?=/)))(?::([0-9]++))?(/(?:(?:[a-z0-9!\*';:=\+,.\$/%#\[\]\-\u2013_~\|&@\u00c0-\u00d6\u00d8-\u00f6\u00f8-\u00ff\u0100-\u024f\u0253\u0254\u0256\u0257\u0259\u025b\u0263\u0268\u026f\u0272\u0289\u028b\u02bb\u0300-\u036f\u1e00-\u1eff\u0400-\u04ff]*(?:\((?:[a-z0-9!\*';:=\+,.\$/%#\[\]\-\u2013_~\|&@\u00c0-\u00d6\u00d8-\u00f6\u00f8-\u00ff\u0100-\u024f\u0253\u0254\u0256\u0257\u0259\u025b\u0263\u0268\u026f\u0272\u0289\u028b\u02bb\u0300-\u036f\u1e00-\u1eff\u0400-\u04ff]+|(?:[a-z0-9!\*';:=\+,.\$/%#\[\]\-\u2013_~\|&@\u00c0-\u00d6\u00d8-\u00f6\u00f8-\u00ff\u0100-\u024f\u0253\u0254\u0256\u0257\u0259\u025b\u0263\u0268\u026f\u0272\u0289\u028b\u02bb\u0300-\u036f\u1e00-\u1eff\u0400-\u04ff]*\([a-z0-9!\*';:=\+,.\$/%#\[\]\-\u2013_~\|&@\u00c0-\u00d6\u00d8-\u00f6\u00f8-\u00ff\u0100-\u024f\u0253\u0254\u0256\u0257\u0259\u025b\u0263\u0268\u026f\u0272\u0289\u028b\u02bb\u0300-\u036f\u1e00-\u1eff\u0400-\u04ff]+\)[a-z0-9!\*';:=\+,.\$/%#\[\]\-\u2013_~\|&@\u00c0-\u00d6\u00d8-\u00f6\u00f8-\u00ff\u0100-\u024f\u0253\u0254\u0256\u0257\u0259\u025b\u0263\u0268\u026f\u0272\u0289\u028b\u02bb\u0300-\u036f\u1e00-\u1eff\u0400-\u04ff]*))\)[a-z0-9!\*';:=\+,.\$/%#\[\]\-\u2013_~\|&@\u00c0-\u00d6\u00d8-\u00f6\u00f8-\u00ff\u0100-\u024f\u0253\u0254\u0256\u0257\u0259\u025b\u0263\u0268\u026f\u0272\u0289\u028b\u02bb\u0300-\u036f\u1e00-\u1eff\u0400-\u04ff]*)*[a-z0-9=_#/\-\+\u00c0-\u00d6\u00d8-\u00f6\u00f8-\u00ff\u0100-\u024f\u0253\u0254\u0256\u0257\u0259\u025b\u0263\u0268\u026f\u0272\u0289\u028b\u02bb\u0300-\u036f\u1e00-\u1eff\u0400-\u04ff]|(?:\((?:[a-z0-9!\*';:=\+,.\$/%#\[\]\-\u2013_~\|&@\u00c0-\u00d6\u00d8-\u00f6\u00f8-\u00ff\u0100-\u024f\u0253\u0254\u0256\u0257\u0259\u025b\u0263\u0268\u026f\u0272\u0289\u028b\u02bb\u0300-\u036f\u1e00-\u1eff\u0400-\u04ff]+|(?:[a-z0-9!\*';:=\+,.\$/%#\[\]\-\u2013_~\|&@\u00c0-\u00d6\u00d8-\u00f6\u00f8-\u00ff\u0100-\u024f\u0253\u0254\u0256\u0257\u0259\u025b\u0263\u0268\u026f\u0272\u0289\u028b\u02bb\u0300-\u036f\u1e00-\u1eff\u0400-\u04ff]*\([a-z0-9!\*';:=\+,.\$/%#\[\]\-\u2013_~\|&@\u00c0-\u00d6\u00d8-\u00f6\u00f8-\u00ff\u0100-\u024f\u0253\u0254\u0256\u0257\u0259\u025b\u0263\u0268\u026f\u0272\u0289\u028b\u02bb\u0300-\u036f\u1e00-\u1eff\u0400-\u04ff]+\)[a-z0-9!\*';:=\+,.\$/%#\[\]\-\u2013_~\|&@\u00c0-\u00d6\u00d8-\u00f6\u00f8-\u00ff\u0100-\u024f\u0253\u0254\u0256\u0257\u0259\u025b\u0263\u0268\u026f\u0272\u0289\u028b\u02bb\u0300-\u036f\u1e00-\u1eff\u0400-\u04ff]*))\)))|(?:@[a-z0-9!\*';:=\+,.\$/%#\[\]\-\u2013_~\|&@\u00c0-\u00d6\u00d8-\u00f6\u00f8-\u00ff\u0100-\u024f\u0253\u0254\u0256\u0257\u0259\u025b\u0263\u0268\u026f\u0272\u0289\u028b\u02bb\u0300-\u036f\u1e00-\u1eff\u0400-\u04ff]+/))*+)?(\?[a-z0-9!?\*'\(\);:&=\+\$/%#\[\]\-_\.,~\|@]*[a-z0-9\-_&=#/])?))""".r.pattern
  val VALID_HASHTAG =
    """(?i)(^|\uFE0E|\uFE0F|[^&\p{L}\p{M}\u037f\u0528-\u052f\u08a0-\u08b2\u08e4-\u08ff\u0978\u0980\u0c00\u0c34\u0c81\u0d01\u0ede\u0edf\u10c7\u10cd\u10fd-\u10ff\u16f1-\u16f8\u17b4\u17b5\u191d\u191e\u1ab0-\u1abe\u1bab-\u1bad\u1bba-\u1bbf\u1cf3-\u1cf6\u1cf8\u1cf9\u1de7-\u1df5\u2cf2\u2cf3\u2d27\u2d2d\u2d66\u2d67\u9fcc\ua674-\ua67b\ua698-\ua69d\ua69f\ua792-\ua79f\ua7aa-\ua7ad\ua7b0\ua7b1\ua7f7-\ua7f9\ua9e0-\ua9ef\ua9fa-\ua9fe\uaa7c-\uaa7f\uaae0-\uaaef\uaaf2-\uaaf6\uab30-\uab5a\uab5c-\uab5f\uab64\uab65\uf870-\uf87f\uf882\uf884-\uf89f\uf8b8\uf8c1-\uf8d6\ufa2e\ufa2f\ufe27-\ufe2d\ud800\udee0\ud800\udf1f\ud800\udf50-\ud800\udf7a\ud801\udd00-\ud801\udd27\ud801\udd30-\ud801\udd63\ud801\ude00-\ud801\udf36\ud801\udf40-\ud801\udf55\ud801\udf60-\ud801\udf67\ud802\udc60-\ud802\udc76\ud802\udc80-\ud802\udc9e\ud802\udd80-\ud802\uddb7\ud802\uddbe\ud802\uddbf\ud802\ude80-\ud802\ude9c\ud802\udec0-\ud802\udec7\ud802\udec9-\ud802\udee6\ud802\udf80-\ud802\udf91\ud804\udc7f\ud804\udcd0-\ud804\udce8\ud804\udd00-\ud804\udd34\ud804\udd50-\ud804\udd73\ud804\udd76\ud804\udd80-\ud804\uddc4\ud804\uddda\ud804\ude00-\ud804\ude11\ud804\ude13-\ud804\ude37\ud804\udeb0-\ud804\udeea\ud804\udf01-\ud804\udf03\ud804\udf05-\ud804\udf0c\ud804\udf0f\ud804\udf10\ud804\udf13-\ud804\udf28\ud804\udf2a-\ud804\udf30\ud804\udf32\ud804\udf33\ud804\udf35-\ud804\udf39\ud804\udf3c-\ud804\udf44\ud804\udf47\ud804\udf48\ud804\udf4b-\ud804\udf4d\ud804\udf57\ud804\udf5d-\ud804\udf63\ud804\udf66-\ud804\udf6c\ud804\udf70-\ud804\udf74\ud805\udc80-\ud805\udcc5\ud805\udcc7\ud805\udd80-\ud805\uddb5\ud805\uddb8-\ud805\uddc0\ud805\ude00-\ud805\ude40\ud805\ude44\ud805\ude80-\ud805\udeb7\ud806\udca0-\ud806\udcdf\ud806\udcff\ud806\udec0-\ud806\udef8\ud808\udf6f-\ud808\udf98\ud81a\ude40-\ud81a\ude5e\ud81a\uded0-\ud81a\udeed\ud81a\udef0-\ud81a\udef4\ud81a\udf00-\ud81a\udf36\ud81a\udf40-\ud81a\udf43\ud81a\udf63-\ud81a\udf77\ud81a\udf7d-\ud81a\udf8f\ud81b\udf00-\ud81b\udf44\ud81b\udf50-\ud81b\udf7e\ud81b\udf8f-\ud81b\udf9f\ud82f\udc00-\ud82f\udc6a\ud82f\udc70-\ud82f\udc7c\ud82f\udc80-\ud82f\udc88\ud82f\udc90-\ud82f\udc99\ud82f\udc9d\ud82f\udc9e\ud83a\udc00-\ud83a\udcc4\ud83a\udcd0-\ud83a\udcd6\ud83b\ude00-\ud83b\ude03\ud83b\ude05-\ud83b\ude1f\ud83b\ude21\ud83b\ude22\ud83b\ude24\ud83b\ude27\ud83b\ude29-\ud83b\ude32\ud83b\ude34-\ud83b\ude37\ud83b\ude39\ud83b\ude3b\ud83b\ude42\ud83b\ude47\ud83b\ude49\ud83b\ude4b\ud83b\ude4d-\ud83b\ude4f\ud83b\ude51\ud83b\ude52\ud83b\ude54\ud83b\ude57\ud83b\ude59\ud83b\ude5b\ud83b\ude5d\ud83b\ude5f\ud83b\ude61\ud83b\ude62\ud83b\ude64\ud83b\ude67-\ud83b\ude6a\ud83b\ude6c-\ud83b\ude72\ud83b\ude74-\ud83b\ude77\ud83b\ude79-\ud83b\ude7c\ud83b\ude7e\ud83b\ude80-\ud83b\ude89\ud83b\ude8b-\ud83b\ude9b\ud83b\udea1-\ud83b\udea3\ud83b\udea5-\ud83b\udea9\ud83b\udeab-\ud83b\udebb\p{Nd}\u0de6-\u0def\ua9f0-\ua9f9\ud804\udcf0-\ud804\udcf9\ud804\udd36-\ud804\udd3f\ud804\uddd0-\ud804\uddd9\ud804\udef0-\ud804\udef9\ud805\udcd0-\ud805\udcd9\ud805\ude50-\ud805\ude59\ud805\udec0-\ud805\udec9\ud806\udce0-\ud806\udce9\ud81a\ude60-\ud81a\ude69\ud81a\udf50-\ud81a\udf59_\u200c\u200d\ua67e\u05be\u05f3\u05f4\uff5e\u301c\u309b\u309c\u30a0\u30fb\u3003\u0f0b\u0f0c\u00b7])([#＃])(?![️⃣])([\p{L}\p{M}\u037f\u0528-\u052f\u08a0-\u08b2\u08e4-\u08ff\u0978\u0980\u0c00\u0c34\u0c81\u0d01\u0ede\u0edf\u10c7\u10cd\u10fd-\u10ff\u16f1-\u16f8\u17b4\u17b5\u191d\u191e\u1ab0-\u1abe\u1bab-\u1bad\u1bba-\u1bbf\u1cf3-\u1cf6\u1cf8\u1cf9\u1de7-\u1df5\u2cf2\u2cf3\u2d27\u2d2d\u2d66\u2d67\u9fcc\ua674-\ua67b\ua698-\ua69d\ua69f\ua792-\ua79f\ua7aa-\ua7ad\ua7b0\ua7b1\ua7f7-\ua7f9\ua9e0-\ua9ef\ua9fa-\ua9fe\uaa7c-\uaa7f\uaae0-\uaaef\uaaf2-\uaaf6\uab30-\uab5a\uab5c-\uab5f\uab64\uab65\uf870-\uf87f\uf882\uf884-\uf89f\uf8b8\uf8c1-\uf8d6\ufa2e\ufa2f\ufe27-\ufe2d\ud800\udee0\ud800\udf1f\ud800\udf50-\ud800\udf7a\ud801\udd00-\ud801\udd27\ud801\udd30-\ud801\udd63\ud801\ude00-\ud801\udf36\ud801\udf40-\ud801\udf55\ud801\udf60-\ud801\udf67\ud802\udc60-\ud802\udc76\ud802\udc80-\ud802\udc9e\ud802\udd80-\ud802\uddb7\ud802\uddbe\ud802\uddbf\ud802\ude80-\ud802\ude9c\ud802\udec0-\ud802\udec7\ud802\udec9-\ud802\udee6\ud802\udf80-\ud802\udf91\ud804\udc7f\ud804\udcd0-\ud804\udce8\ud804\udd00-\ud804\udd34\ud804\udd50-\ud804\udd73\ud804\udd76\ud804\udd80-\ud804\uddc4\ud804\uddda\ud804\ude00-\ud804\ude11\ud804\ude13-\ud804\ude37\ud804\udeb0-\ud804\udeea\ud804\udf01-\ud804\udf03\ud804\udf05-\ud804\udf0c\ud804\udf0f\ud804\udf10\ud804\udf13-\ud804\udf28\ud804\udf2a-\ud804\udf30\ud804\udf32\ud804\udf33\ud804\udf35-\ud804\udf39\ud804\udf3c-\ud804\udf44\ud804\udf47\ud804\udf48\ud804\udf4b-\ud804\udf4d\ud804\udf57\ud804\udf5d-\ud804\udf63\ud804\udf66-\ud804\udf6c\ud804\udf70-\ud804\udf74\ud805\udc80-\ud805\udcc5\ud805\udcc7\ud805\udd80-\ud805\uddb5\ud805\uddb8-\ud805\uddc0\ud805\ude00-\ud805\ude40\ud805\ude44\ud805\ude80-\ud805\udeb7\ud806\udca0-\ud806\udcdf\ud806\udcff\ud806\udec0-\ud806\udef8\ud808\udf6f-\ud808\udf98\ud81a\ude40-\ud81a\ude5e\ud81a\uded0-\ud81a\udeed\ud81a\udef0-\ud81a\udef4\ud81a\udf00-\ud81a\udf36\ud81a\udf40-\ud81a\udf43\ud81a\udf63-\ud81a\udf77\ud81a\udf7d-\ud81a\udf8f\ud81b\udf00-\ud81b\udf44\ud81b\udf50-\ud81b\udf7e\ud81b\udf8f-\ud81b\udf9f\ud82f\udc00-\ud82f\udc6a\ud82f\udc70-\ud82f\udc7c\ud82f\udc80-\ud82f\udc88\ud82f\udc90-\ud82f\udc99\ud82f\udc9d\ud82f\udc9e\ud83a\udc00-\ud83a\udcc4\ud83a\udcd0-\ud83a\udcd6\ud83b\ude00-\ud83b\ude03\ud83b\ude05-\ud83b\ude1f\ud83b\ude21\ud83b\ude22\ud83b\ude24\ud83b\ude27\ud83b\ude29-\ud83b\ude32\ud83b\ude34-\ud83b\ude37\ud83b\ude39\ud83b\ude3b\ud83b\ude42\ud83b\ude47\ud83b\ude49\ud83b\ude4b\ud83b\ude4d-\ud83b\ude4f\ud83b\ude51\ud83b\ude52\ud83b\ude54\ud83b\ude57\ud83b\ude59\ud83b\ude5b\ud83b\ude5d\ud83b\ude5f\ud83b\ude61\ud83b\ude62\ud83b\ude64\ud83b\ude67-\ud83b\ude6a\ud83b\ude6c-\ud83b\ude72\ud83b\ude74-\ud83b\ude77\ud83b\ude79-\ud83b\ude7c\ud83b\ude7e\ud83b\ude80-\ud83b\ude89\ud83b\ude8b-\ud83b\ude9b\ud83b\udea1-\ud83b\udea3\ud83b\udea5-\ud83b\udea9\ud83b\udeab-\ud83b\udebb\p{Nd}\u0de6-\u0def\ua9f0-\ua9f9\ud804\udcf0-\ud804\udcf9\ud804\udd36-\ud804\udd3f\ud804\uddd0-\ud804\uddd9\ud804\udef0-\ud804\udef9\ud805\udcd0-\ud805\udcd9\ud805\ude50-\ud805\ude59\ud805\udec0-\ud805\udec9\ud806\udce0-\ud806\udce9\ud81a\ude60-\ud81a\ude69\ud81a\udf50-\ud81a\udf59_\u200c\u200d\ua67e\u05be\u05f3\u05f4\uff5e\u301c\u309b\u309c\u30a0\u30fb\u3003\u0f0b\u0f0c\u00b7]*[\p{L}\p{M}\u037f\u0528-\u052f\u08a0-\u08b2\u08e4-\u08ff\u0978\u0980\u0c00\u0c34\u0c81\u0d01\u0ede\u0edf\u10c7\u10cd\u10fd-\u10ff\u16f1-\u16f8\u17b4\u17b5\u191d\u191e\u1ab0-\u1abe\u1bab-\u1bad\u1bba-\u1bbf\u1cf3-\u1cf6\u1cf8\u1cf9\u1de7-\u1df5\u2cf2\u2cf3\u2d27\u2d2d\u2d66\u2d67\u9fcc\ua674-\ua67b\ua698-\ua69d\ua69f\ua792-\ua79f\ua7aa-\ua7ad\ua7b0\ua7b1\ua7f7-\ua7f9\ua9e0-\ua9ef\ua9fa-\ua9fe\uaa7c-\uaa7f\uaae0-\uaaef\uaaf2-\uaaf6\uab30-\uab5a\uab5c-\uab5f\uab64\uab65\uf870-\uf87f\uf882\uf884-\uf89f\uf8b8\uf8c1-\uf8d6\ufa2e\ufa2f\ufe27-\ufe2d\ud800\udee0\ud800\udf1f\ud800\udf50-\ud800\udf7a\ud801\udd00-\ud801\udd27\ud801\udd30-\ud801\udd63\ud801\ude00-\ud801\udf36\ud801\udf40-\ud801\udf55\ud801\udf60-\ud801\udf67\ud802\udc60-\ud802\udc76\ud802\udc80-\ud802\udc9e\ud802\udd80-\ud802\uddb7\ud802\uddbe\ud802\uddbf\ud802\ude80-\ud802\ude9c\ud802\udec0-\ud802\udec7\ud802\udec9-\ud802\udee6\ud802\udf80-\ud802\udf91\ud804\udc7f\ud804\udcd0-\ud804\udce8\ud804\udd00-\ud804\udd34\ud804\udd50-\ud804\udd73\ud804\udd76\ud804\udd80-\ud804\uddc4\ud804\uddda\ud804\ude00-\ud804\ude11\ud804\ude13-\ud804\ude37\ud804\udeb0-\ud804\udeea\ud804\udf01-\ud804\udf03\ud804\udf05-\ud804\udf0c\ud804\udf0f\ud804\udf10\ud804\udf13-\ud804\udf28\ud804\udf2a-\ud804\udf30\ud804\udf32\ud804\udf33\ud804\udf35-\ud804\udf39\ud804\udf3c-\ud804\udf44\ud804\udf47\ud804\udf48\ud804\udf4b-\ud804\udf4d\ud804\udf57\ud804\udf5d-\ud804\udf63\ud804\udf66-\ud804\udf6c\ud804\udf70-\ud804\udf74\ud805\udc80-\ud805\udcc5\ud805\udcc7\ud805\udd80-\ud805\uddb5\ud805\uddb8-\ud805\uddc0\ud805\ude00-\ud805\ude40\ud805\ude44\ud805\ude80-\ud805\udeb7\ud806\udca0-\ud806\udcdf\ud806\udcff\ud806\udec0-\ud806\udef8\ud808\udf6f-\ud808\udf98\ud81a\ude40-\ud81a\ude5e\ud81a\uded0-\ud81a\udeed\ud81a\udef0-\ud81a\udef4\ud81a\udf00-\ud81a\udf36\ud81a\udf40-\ud81a\udf43\ud81a\udf63-\ud81a\udf77\ud81a\udf7d-\ud81a\udf8f\ud81b\udf00-\ud81b\udf44\ud81b\udf50-\ud81b\udf7e\ud81b\udf8f-\ud81b\udf9f\ud82f\udc00-\ud82f\udc6a\ud82f\udc70-\ud82f\udc7c\ud82f\udc80-\ud82f\udc88\ud82f\udc90-\ud82f\udc99\ud82f\udc9d\ud82f\udc9e\ud83a\udc00-\ud83a\udcc4\ud83a\udcd0-\ud83a\udcd6\ud83b\ude00-\ud83b\ude03\ud83b\ude05-\ud83b\ude1f\ud83b\ude21\ud83b\ude22\ud83b\ude24\ud83b\ude27\ud83b\ude29-\ud83b\ude32\ud83b\ude34-\ud83b\ude37\ud83b\ude39\ud83b\ude3b\ud83b\ude42\ud83b\ude47\ud83b\ude49\ud83b\ude4b\ud83b\ude4d-\ud83b\ude4f\ud83b\ude51\ud83b\ude52\ud83b\ude54\ud83b\ude57\ud83b\ude59\ud83b\ude5b\ud83b\ude5d\ud83b\ude5f\ud83b\ude61\ud83b\ude62\ud83b\ude64\ud83b\ude67-\ud83b\ude6a\ud83b\ude6c-\ud83b\ude72\ud83b\ude74-\ud83b\ude77\ud83b\ude79-\ud83b\ude7c\ud83b\ude7e\ud83b\ude80-\ud83b\ude89\ud83b\ude8b-\ud83b\ude9b\ud83b\udea1-\ud83b\udea3\ud83b\udea5-\ud83b\udea9\ud83b\udeab-\ud83b\udebb][\p{L}\p{M}\u037f\u0528-\u052f\u08a0-\u08b2\u08e4-\u08ff\u0978\u0980\u0c00\u0c34\u0c81\u0d01\u0ede\u0edf\u10c7\u10cd\u10fd-\u10ff\u16f1-\u16f8\u17b4\u17b5\u191d\u191e\u1ab0-\u1abe\u1bab-\u1bad\u1bba-\u1bbf\u1cf3-\u1cf6\u1cf8\u1cf9\u1de7-\u1df5\u2cf2\u2cf3\u2d27\u2d2d\u2d66\u2d67\u9fcc\ua674-\ua67b\ua698-\ua69d\ua69f\ua792-\ua79f\ua7aa-\ua7ad\ua7b0\ua7b1\ua7f7-\ua7f9\ua9e0-\ua9ef\ua9fa-\ua9fe\uaa7c-\uaa7f\uaae0-\uaaef\uaaf2-\uaaf6\uab30-\uab5a\uab5c-\uab5f\uab64\uab65\uf870-\uf87f\uf882\uf884-\uf89f\uf8b8\uf8c1-\uf8d6\ufa2e\ufa2f\ufe27-\ufe2d\ud800\udee0\ud800\udf1f\ud800\udf50-\ud800\udf7a\ud801\udd00-\ud801\udd27\ud801\udd30-\ud801\udd63\ud801\ude00-\ud801\udf36\ud801\udf40-\ud801\udf55\ud801\udf60-\ud801\udf67\ud802\udc60-\ud802\udc76\ud802\udc80-\ud802\udc9e\ud802\udd80-\ud802\uddb7\ud802\uddbe\ud802\uddbf\ud802\ude80-\ud802\ude9c\ud802\udec0-\ud802\udec7\ud802\udec9-\ud802\udee6\ud802\udf80-\ud802\udf91\ud804\udc7f\ud804\udcd0-\ud804\udce8\ud804\udd00-\ud804\udd34\ud804\udd50-\ud804\udd73\ud804\udd76\ud804\udd80-\ud804\uddc4\ud804\uddda\ud804\ude00-\ud804\ude11\ud804\ude13-\ud804\ude37\ud804\udeb0-\ud804\udeea\ud804\udf01-\ud804\udf03\ud804\udf05-\ud804\udf0c\ud804\udf0f\ud804\udf10\ud804\udf13-\ud804\udf28\ud804\udf2a-\ud804\udf30\ud804\udf32\ud804\udf33\ud804\udf35-\ud804\udf39\ud804\udf3c-\ud804\udf44\ud804\udf47\ud804\udf48\ud804\udf4b-\ud804\udf4d\ud804\udf57\ud804\udf5d-\ud804\udf63\ud804\udf66-\ud804\udf6c\ud804\udf70-\ud804\udf74\ud805\udc80-\ud805\udcc5\ud805\udcc7\ud805\udd80-\ud805\uddb5\ud805\uddb8-\ud805\uddc0\ud805\ude00-\ud805\ude40\ud805\ude44\ud805\ude80-\ud805\udeb7\ud806\udca0-\ud806\udcdf\ud806\udcff\ud806\udec0-\ud806\udef8\ud808\udf6f-\ud808\udf98\ud81a\ude40-\ud81a\ude5e\ud81a\uded0-\ud81a\udeed\ud81a\udef0-\ud81a\udef4\ud81a\udf00-\ud81a\udf36\ud81a\udf40-\ud81a\udf43\ud81a\udf63-\ud81a\udf77\ud81a\udf7d-\ud81a\udf8f\ud81b\udf00-\ud81b\udf44\ud81b\udf50-\ud81b\udf7e\ud81b\udf8f-\ud81b\udf9f\ud82f\udc00-\ud82f\udc6a\ud82f\udc70-\ud82f\udc7c\ud82f\udc80-\ud82f\udc88\ud82f\udc90-\ud82f\udc99\ud82f\udc9d\ud82f\udc9e\ud83a\udc00-\ud83a\udcc4\ud83a\udcd0-\ud83a\udcd6\ud83b\ude00-\ud83b\ude03\ud83b\ude05-\ud83b\ude1f\ud83b\ude21\ud83b\ude22\ud83b\ude24\ud83b\ude27\ud83b\ude29-\ud83b\ude32\ud83b\ude34-\ud83b\ude37\ud83b\ude39\ud83b\ude3b\ud83b\ude42\ud83b\ude47\ud83b\ude49\ud83b\ude4b\ud83b\ude4d-\ud83b\ude4f\ud83b\ude51\ud83b\ude52\ud83b\ude54\ud83b\ude57\ud83b\ude59\ud83b\ude5b\ud83b\ude5d\ud83b\ude5f\ud83b\ude61\ud83b\ude62\ud83b\ude64\ud83b\ude67-\ud83b\ude6a\ud83b\ude6c-\ud83b\ude72\ud83b\ude74-\ud83b\ude77\ud83b\ude79-\ud83b\ude7c\ud83b\ude7e\ud83b\ude80-\ud83b\ude89\ud83b\ude8b-\ud83b\ude9b\ud83b\udea1-\ud83b\udea3\ud83b\udea5-\ud83b\udea9\ud83b\udeab-\ud83b\udebb\p{Nd}\u0de6-\u0def\ua9f0-\ua9f9\ud804\udcf0-\ud804\udcf9\ud804\udd36-\ud804\udd3f\ud804\uddd0-\ud804\uddd9\ud804\udef0-\ud804\udef9\ud805\udcd0-\ud805\udcd9\ud805\ude50-\ud805\ude59\ud805\udec0-\ud805\udec9\ud806\udce0-\ud806\udce9\ud81a\ude60-\ud81a\ude69\ud81a\udf50-\ud81a\udf59_\u200c\u200d\ua67e\u05be\u05f3\u05f4\uff5e\u301c\u309b\u309c\u30a0\u30fb\u3003\u0f0b\u0f0c\u00b7]*)""".r.pattern
  val VALID_MENTION_OR_LIST =
    """(?i)([^a-z0-9_!#$%&*@＠]|^|(?:^|[^a-z0-9_+~.-])RT:?)([@＠]+)([a-z0-9_]{1,20})(/[a-z][a-z0-9_\-]{0,24})?""".r.pattern
  val VALID_CASHTAG =
    """(?i)(^|[\u0009-\u000d\u0020\u0085\u00a0\u1680\u180E\u2000-\u200a\u2028\u2029\u202F\u205F\u3000]|\u061C\u200E\u200F\u202A\u202B\u202C\u202D\u202E\u2066\u2067\u2068\u2069)(\$)([a-z]{1,6}(?:[._][a-z]{1,2})?)(?=$|\s|\p{Punct})""".r.pattern
}
````

## File: src/main/scala/is/gregoirege/oktjs/Okt.scala
````scala
package is.gregoirege.oktjs

import org.openkoreantext.processor.OpenKoreanTextProcessor
import org.openkoreantext.processor.phrase_extractor.KoreanPhraseExtractor
import org.openkoreantext.processor.stemmer.KoreanStemmer
import org.openkoreantext.processor.tokenizer.{KoreanTokenizer, Sentence}
import org.openkoreantext.processor.util.KoreanPos
import scala.scalajs.js
import scala.scalajs.js.annotation.JSExportTopLevel
import js.JSConverters._

@JSExportTopLevel("KoreanToken")
class KoreanToken(inner: KoreanTokenizer.KoreanToken) extends js.Object {
  val pos = inner.pos.toString
  val text = inner.text
  val offset = inner.offset
  val length = inner.length
  val stem = inner.stem.orUndefined
  val isUnknown = inner.unknown
}

@JSExportTopLevel("KoreanSentence")
class KoreanSentence(inner: Sentence) extends js.Object {
  val text = inner.text
  val offset = inner.start
  val length = inner.end - inner.start
}

@JSExportTopLevel("KoreanPhrase")
class KoreanPhrase(inner: KoreanPhraseExtractor.KoreanPhrase) extends js.Object {
  val tokens = inner.tokens.map(new KoreanToken(_)).toJSArray
  val pos = inner.pos.toString
  val offset = inner.offset
  val length = inner.length
  val text = inner.text
}

@JSExportTopLevel("Okt")
object Okt extends js.Object {
  trait ExtractPhrasesOptions extends js.Object {
    val filterSpam: js.UndefOr[Boolean] = js.undefined
    val enableHashtags: js.UndefOr[Boolean] = js.undefined
  }

  def init() =
    OpenKoreanTextProcessor.loadResources()

  def normalize(text: String): String =
    OpenKoreanTextProcessor.normalize(text).toString

  def tokenize(text: String): js.Array[KoreanToken] =
    OpenKoreanTextProcessor.tokenize(text).map(new KoreanToken(_)).toJSArray

  def tokenizeTopN(text: String, n: Int): js.Array[js.Array[js.Array[KoreanToken]]] =
    OpenKoreanTextProcessor.tokenizeTopN(text, n)
      .map(_.map(KoreanStemmer.stem(_).map(new KoreanToken(_)).toJSArray).toJSArray)
      .toJSArray

  def detokenize(tokens: js.Iterable[String]): String =
    OpenKoreanTextProcessor.detokenize(tokens)

  def splitSentences(text: String): js.Array[KoreanSentence] =
    OpenKoreanTextProcessor.splitSentences(text).map(new KoreanSentence(_)).toJSArray

  def extractPhrases(text: String,
                     options: js.UndefOr[ExtractPhrasesOptions]): js.Array[KoreanPhrase] = {
    val tokens = OpenKoreanTextProcessor.tokenize(text)
    val filterSpam = options.flatMap(_.filterSpam).getOrElse(false)
    val enableHashtags = options.flatMap(_.enableHashtags).getOrElse(true)

    OpenKoreanTextProcessor.extractPhrases(tokens, filterSpam, enableHashtags)
      .map(new KoreanPhrase(_))
      .toJSArray
  }

  def extractPhrases(tokens: js.Iterable[KoreanToken],
                     options: js.UndefOr[ExtractPhrasesOptions]): js.Array[KoreanPhrase] = {
    def toNativeKoreanToken(t: KoreanToken): KoreanTokenizer.KoreanToken =
      KoreanTokenizer.KoreanToken(
        t.text, KoreanPos.withName(t.pos), t.offset, t.length, t.stem.toOption, t.isUnknown)

    val nativeTokens = tokens.map(toNativeKoreanToken).toSeq
    val filterSpam = options.flatMap(_.filterSpam).getOrElse(false)
    val enableHashtags = options.flatMap(_.enableHashtags).getOrElse(true)

    OpenKoreanTextProcessor.extractPhrases(nativeTokens, filterSpam, enableHashtags)
      .map(new KoreanPhrase(_))
      .toJSArray
  }
}
````

## File: src/main/scala/is/gregoirege/oktjs/Resources.scala
````scala
package is.gregoirege.oktjs

import scala.scalajs.js
import scala.scalajs.js.annotation.JSGlobal

@js.native
@JSGlobal
object Resources extends js.Object {
  def read(filename: String): String = js.native
}
````

## File: src/main/scala/org/openkoreantext/processor/util/CharArraySet.scala
````scala
package org.openkoreantext.processor.util

import scala.scalajs.js.Set
import scala.jdk.CollectionConverters._

class CharArraySet(val set: Set[String] = new Set()) {
  def this(capacity: Int) = this()

  def contains(element: CharSequence): Boolean = set.contains(element.toString)
  def add(element: CharSequence): Boolean = set.add(element.toString)
  def addAll(elements: java.lang.Iterable[String]): Boolean = elements.asScala.count(set.add(_)) > 0
  def removeAll(elements: java.lang.Iterable[String]): Boolean = elements.asScala.count(set.remove(_)) > 0
}
````

## File: src/main/scala/org/openkoreantext/processor/util/KoreanDictionaryProviderShim.scala
````scala
/*
 * Open Korean Text - Scala library to process Korean text
 *
 * Copyright 2014 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package org.openkoreantext.processor.util

import java.util

import org.openkoreantext.processor.util.KoreanConjugation._
import org.openkoreantext.processor.util.KoreanPos._

import scala.collection.JavaConverters._

object KoreanDictionaryProvider {
  private[this] def readWordFreqs(filename: String): util.HashMap[CharSequence, Float] = {
    var freqMap: util.HashMap[CharSequence, Float] =
      new java.util.HashMap[CharSequence, Float]

    readFileByLineFromResources(filename).foreach {
      line =>
        if (line.contains("\t")) {
          val data = line.split("\t")
          freqMap.put(data(0), data(1).slice(0, 6).toFloat)
        }
    }
    freqMap
  }

  private[this] def readWordMap(filename: String): Map[String, String] = {
    readFileByLineFromResources(filename).filter {
      line: String => line.contains(" ")
    }.map {
      line =>
        val data = line.split(" ")
        (data(0), data(1))
    }.toMap
  }


  protected[processor] def readWordsAsSeq(filename: String): Seq[String] =
    readFileByLineFromResources(filename).toSeq


  protected[processor] def readWordsAsSet(filenames: String*): Set[String] = {
    filenames.foldLeft(Set[String]()) {
      case (output: Set[String], filename: String) =>
        output.union(
          readFileByLineFromResources(filename).toSet
        )
    }
  }

  protected[processor] def readWords(filenames: String*): CharArraySet = {
    val set = newCharArraySet
    filenames.foreach(
      filename => readFileByLineFromResources(filename).foreach(set.add)
    )
    set
  }

  protected[processor] def readFileByLineFromResources(filename: String): Iterator[String] = {
    is.gregoirege.oktjs.Resources.read(filename)
      .split("\n")
      .iterator
      .map(_.trim)
      .filter(_.length > 0)
  }

  protected[processor] def newCharArraySet: CharArraySet = {
    new CharArraySet(10000)
  }

  lazy val koreanEntityFreq: util.HashMap[CharSequence, Float] =
    readWordFreqs("freq/entity-freq.txt.gz")

  def addWordsToDictionary(pos: KoreanPos, words: Seq[String]): Boolean = {
    koreanDictionary.get(pos).addAll(words.asJava)
  }

  def removeWordsToDictionary(pos: KoreanPos, words: Seq[String]): Boolean = {
    koreanDictionary.get(pos).removeAll(words.asJava)
  }

  val koreanDictionary: util.HashMap[KoreanPos, CharArraySet] = {
    val map: util.HashMap[KoreanPos, CharArraySet] =
      new java.util.HashMap[KoreanPos, CharArraySet]

    map.put(Noun, readWords(
      "noun/nouns.txt", "noun/entities.txt", "noun/spam.txt",
      "noun/names.txt", "noun/twitter.txt", "noun/lol.txt",
      "noun/slangs.txt", "noun/company_names.txt",
      "noun/foreign.txt", "noun/geolocations.txt", "noun/profane.txt",
      "substantives/given_names.txt", "noun/kpop.txt", "noun/bible.txt",
      "noun/pokemon.txt", "noun/congress.txt", "noun/wikipedia_title_nouns.txt",
      "noun/brand.txt", "noun/fashion.txt", "noun/neologism.txt"
    ))
    map.put(Verb, conjugatePredicatesToCharArraySet(readWordsAsSet("verb/verb.txt")))
    map.put(Adjective, conjugatePredicatesToCharArraySet(readWordsAsSet("adjective/adjective.txt"), isAdjective = true))
    map.put(Adverb, readWords("adverb/adverb.txt"))
    map.put(Determiner, readWords("auxiliary/determiner.txt"))
    map.put(Exclamation, readWords("auxiliary/exclamation.txt"))
    map.put(Josa, readWords("josa/josa.txt"))
    map.put(Eomi, readWords("verb/eomi.txt"))
    map.put(PreEomi, readWords("verb/pre_eomi.txt"))
    map.put(Conjunction, readWords("auxiliary/conjunctions.txt"))
    map.put(Modifier, readWords("substantives/modifier.txt"))
    map.put(VerbPrefix, readWords("verb/verb_prefix.txt"))
    map.put(Suffix, readWords("substantives/suffix.txt"))
    map
  }

  lazy val spamNouns: CharArraySet = readWords("noun/spam.txt", "noun/profane.txt")

  val properNouns: CharArraySet = readWords("noun/entities.txt",
    "noun/names.txt", "noun/twitter.txt", "noun/lol.txt", "noun/company_names.txt",
    "noun/foreign.txt", "noun/geolocations.txt",
    "substantives/given_names.txt", "noun/kpop.txt", "noun/bible.txt",
    "noun/pokemon.txt", "noun/congress.txt", "noun/wikipedia_title_nouns.txt",
    "noun/brand.txt", "noun/fashion.txt", "noun/neologism.txt")

  lazy val nameDictionary = Map(
    'family_name -> readWords("substantives/family_names.txt"),
    'given_name -> readWords("substantives/given_names.txt"),
    'full_name -> readWords("noun/kpop.txt", "noun/foreign.txt", "noun/names.txt")
  )

  lazy val typoDictionaryByLength: Map[Int, Map[String, String]] = readWordMap("typos/typos.txt").groupBy {
    case (key: String, value: String) => key.length
  }

  lazy val predicateStems: Map[KoreanPos.Value, Map[String, String]] = {
    def getConjugationMap(words: Set[String], isAdjective: Boolean): Map[String, String] = {
      words.flatMap {
        word: String =>
          conjugatePredicated(Set(word), isAdjective).map {
            conjugated => (conjugated.toString, word + "다")
          }
      }.toMap
    }

    Map(
      Verb -> getConjugationMap(readWordsAsSet("verb/verb.txt"), isAdjective = false),
      Adjective -> getConjugationMap(readWordsAsSet("adjective/adjective.txt"), isAdjective = true)
    )
  }
}
````

## File: src/index.js
````javascript
import { Okt } from "../target/scala-2.13/oktjs-opt/main.js";

export const {
  detokenize,
  extractPhrases,
  init,
  normalize,
  splitSentences,
  tokenize,
  tokenizeTopN,
} = Okt;
````

## File: .gitignore
````
/.bsp/
/node_modules/
/target/
/index.js
/resources.json.gz
/project/
````

## File: .gitmodules
````
[submodule "open-korean-text"]
	path = open-korean-text
	url = git@github.com:open-korean-text/open-korean-text.git
````

## File: .npmignore
````
*
!/README.md
!/LICENSE
!/package.json
!/index.js
!/index.d.ts
````

## File: build.sbt
````
import org.scalajs.linker.interface.ESVersion

ThisBuild / scalaVersion     := "2.13.1"
ThisBuild / version          := "0.1.0-SNAPSHOT"
ThisBuild / organization     := "is.gregoirege"
ThisBuild / organizationName := "gregoiregeis"

lazy val root = (project in file("."))
  .settings(
    name := "oktjs",
  )

Compile / unmanagedSourceDirectories += baseDirectory.value / "open-korean-text/src/main/scala"
Compile / unmanagedResourceDirectories += baseDirectory.value / "open-korean-text/src/main/resources"
Compile / unmanagedSources / excludeFilter := "KoreanDictionaryProvider.scala"

enablePlugins(ScalaJSPlugin)

scalaJSLinkerConfig ~= { _.withModuleKind(ModuleKind.ESModule) }
scalaJSLinkerConfig ~= { _.withESFeatures(_.withESVersion(ESVersion.ES2021)) }
````

## File: example.js
````javascript
import assert from "assert";

/** @type import("./index.ts") */
import {
  detokenize,
  extractPhrases,
  normalize,
  splitSentences,
  tokenize,
  tokenizeTopN,
} from "./index.js";

const text = "한국어를 처리하는 예시입니닼ㅋㅋㅋㅋㅋ #한국어";

// Normalize.
const normalized = normalize(text);

assert.strictEqual(normalized, "한국어를 처리하는 예시입니다ㅋㅋㅋ #한국어");

// Tokenize.
const tokens = tokenize(normalized);

// Tokens have a class, so we must convert them to plain objects before
// comparing them.
assert.deepStrictEqual(tokens.map((t) => ({ ...t })), [
  {
    pos: "Noun",
    text: "한국어",
    offset: 0,
    length: 3,
    stem: undefined,
    isUnknown: false,
  },
  {
    pos: "Josa",
    text: "를",
    offset: 3,
    length: 1,
    stem: undefined,
    isUnknown: false,
  },
  {
    pos: "Space",
    text: " ",
    offset: 4,
    length: 1,
    stem: undefined,
    isUnknown: false,
  },
  {
    pos: "Noun",
    text: "처리",
    offset: 5,
    length: 2,
    stem: undefined,
    isUnknown: false,
  },
  {
    pos: "Verb",
    text: "하는",
    offset: 7,
    length: 2,
    stem: "하다",
    isUnknown: false,
  },
  {
    pos: "Space",
    text: " ",
    offset: 9,
    length: 1,
    stem: undefined,
    isUnknown: false,
  },
  {
    pos: "Noun",
    text: "예시",
    offset: 10,
    length: 2,
    stem: undefined,
    isUnknown: false,
  },
  {
    pos: "Adjective",
    text: "입니다",
    offset: 12,
    length: 3,
    stem: "이다",
    isUnknown: false,
  },
  {
    pos: "KoreanParticle",
    text: "ㅋㅋㅋ",
    offset: 15,
    length: 3,
    stem: undefined,
    isUnknown: false,
  },
  {
    pos: "Space",
    text: " ",
    offset: 18,
    length: 1,
    stem: undefined,
    isUnknown: false,
  },
  {
    pos: "Hashtag",
    text: "#한국어",
    offset: 19,
    length: 4,
    stem: undefined,
    isUnknown: false,
  },
]);

// Tokenize top N.
const topNTokens = tokenizeTopN("집에 안 가요", 3);

assert.deepStrictEqual(
  topNTokens.map((t) => t.map((t) => t.map((t) => ({ ...t })))),
  [
    [
      [
        { pos: 'Noun', text: '집', offset: 0, length: 1, stem: undefined, isUnknown: false },
        { pos: 'Josa', text: '에', offset: 1, length: 1, stem: undefined, isUnknown: false },
      ],
      [
        { pos: 'Verb', text: '집에', offset: 0, length: 2, stem: '지다', isUnknown: false },
      ],
      [
        { pos: 'Verb', text: '집', offset: 0, length: 1, stem: '지다', isUnknown: false },
        { pos: 'Josa', text: '에', offset: 1, length: 1, stem: undefined, isUnknown: false },
      ],
    ],
    [
      [
        { pos: 'Space', text: ' ', offset: 2, length: 1, stem: undefined, isUnknown: false },
      ],
    ],
    [
      [
        { pos: 'Noun', text: '안', offset: 3, length: 1, stem: undefined, isUnknown: false },
      ],
      [
        { pos: 'Verb', text: '안', offset: 3, length: 1, stem: '알다', isUnknown: false },
      ],
      [
        { pos: 'Adverb', text: '안', offset: 3, length: 1, stem: undefined, isUnknown: false },
      ],
    ],
    [
      [
        { pos: 'Space', text: ' ', offset: 4, length: 1, stem: undefined, isUnknown: false },
      ],
    ],
    [
      [
        { pos: 'Noun', text: '가요', offset: 5, length: 2, stem: undefined, isUnknown: false },
      ],
      [
        { pos: 'Verb', text: '가요', offset: 5, length: 2, stem: '가다', isUnknown: false },
      ],
      [
        { pos: 'Noun', text: '가', offset: 5, length: 1, stem: undefined, isUnknown: true },
        { pos: 'Josa', text: '요', offset: 6, length: 1, stem: undefined, isUnknown: false },
      ],
    ],
  ],
);

// Detokenize.
const detokenized = detokenize(
  tokens.filter((t) => t.pos !== "Space").map((t) => t.text),
);

assert.strictEqual(detokenized, "한국어를 처리하는 예시 입니다 ㅋㅋㅋ# 한국어");

// Extract phrases.
const phrases = extractPhrases(tokens);

assert.deepStrictEqual(
  phrases.map((p) => ({ ...p, tokens: p.tokens.map((t) => ({ ...t })) })),
  [
    {
      tokens: [
        {
          pos: "Noun",
          text: "한국어",
          offset: 0,
          length: 3,
          stem: undefined,
          isUnknown: false,
        },
      ],
      pos: "Noun",
      offset: 0,
      length: 3,
      text: "한국어",
    },
    {
      tokens: [
        {
          pos: "Noun",
          text: "처리",
          offset: 5,
          length: 2,
          stem: undefined,
          isUnknown: false,
        },
      ],
      pos: "Noun",
      offset: 5,
      length: 2,
      text: "처리",
    },
    {
      tokens: [
        {
          pos: "Noun",
          text: "처리",
          offset: 5,
          length: 2,
          stem: undefined,
          isUnknown: false,
        },
        {
          pos: "Verb",
          text: "하는",
          offset: 7,
          length: 2,
          stem: "하다",
          isUnknown: false,
        },
        {
          pos: "Space",
          text: " ",
          offset: 9,
          length: 1,
          stem: undefined,
          isUnknown: false,
        },
        {
          pos: "Noun",
          text: "예시",
          offset: 10,
          length: 2,
          stem: undefined,
          isUnknown: false,
        },
      ],
      pos: "Noun",
      offset: 5,
      length: 7,
      text: "처리하는 예시",
    },
    {
      tokens: [
        {
          pos: "Noun",
          text: "예시",
          offset: 10,
          length: 2,
          stem: undefined,
          isUnknown: false,
        },
      ],
      pos: "Noun",
      offset: 10,
      length: 2,
      text: "예시",
    },
    {
      tokens: [
        {
          pos: "Hashtag",
          text: "#한국어",
          offset: 19,
          length: 4,
          stem: undefined,
          isUnknown: false,
        },
      ],
      pos: "Hashtag",
      offset: 19,
      length: 4,
      text: "#한국어",
    },
  ],
);
assert.deepStrictEqual(phrases, extractPhrases(normalized));

// Split sentences.
const sentences = splitSentences("안녕! 밥 먹었어?");

assert.deepStrictEqual(sentences.map((s) => ({ ...s })), [
  { text: "안녕!", offset: 0, length: 3 },
  { text: "밥 먹었어?", offset: 4, length: 6 },
]);

console.log("All OK!");
````

## File: flake.lock
````
{
  "nodes": {
    "flake-parts": {
      "inputs": {
        "nixpkgs-lib": "nixpkgs-lib"
      },
      "locked": {
        "lastModified": 1693611461,
        "narHash": "sha256-aPODl8vAgGQ0ZYFIRisxYG5MOGSkIczvu2Cd8Gb9+1Y=",
        "owner": "hercules-ci",
        "repo": "flake-parts",
        "rev": "7f53fdb7bdc5bb237da7fefef12d099e4fd611ca",
        "type": "github"
      },
      "original": {
        "owner": "hercules-ci",
        "repo": "flake-parts",
        "type": "github"
      }
    },
    "nixpkgs": {
      "locked": {
        "lastModified": 1694422566,
        "narHash": "sha256-lHJ+A9esOz9vln/3CJG23FV6Wd2OoOFbDeEs4cMGMqc=",
        "owner": "NixOS",
        "repo": "nixpkgs",
        "rev": "3a2786eea085f040a66ecde1bc3ddc7099f6dbeb",
        "type": "github"
      },
      "original": {
        "owner": "NixOS",
        "ref": "nixos-unstable",
        "repo": "nixpkgs",
        "type": "github"
      }
    },
    "nixpkgs-lib": {
      "locked": {
        "dir": "lib",
        "lastModified": 1693471703,
        "narHash": "sha256-0l03ZBL8P1P6z8MaSDS/MvuU8E75rVxe5eE1N6gxeTo=",
        "owner": "NixOS",
        "repo": "nixpkgs",
        "rev": "3e52e76b70d5508f3cec70b882a29199f4d1ee85",
        "type": "github"
      },
      "original": {
        "dir": "lib",
        "owner": "NixOS",
        "ref": "nixos-unstable",
        "repo": "nixpkgs",
        "type": "github"
      }
    },
    "root": {
      "inputs": {
        "flake-parts": "flake-parts",
        "nixpkgs": "nixpkgs"
      }
    }
  },
  "root": "root",
  "version": 7
}
````

## File: flake.nix
````
{
  inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
  inputs.flake-parts.url = "github:hercules-ci/flake-parts";

  outputs = inputs@{ flake-parts, ... }:
    flake-parts.lib.mkFlake { inherit inputs; } {
      systems = [ "aarch64-darwin" "aarch64-linux" "x86_64-darwin" "x86_64-linux" ];

      perSystem = { config, pkgs, ... }: {
        devShells.default = pkgs.mkShell {
          nativeBuildInputs = [
            pkgs.sbt
            pkgs.yarn
          ];
        };
      };
    };
}
````

## File: index.d.ts
````typescript
/**
 * The part-of-speech of a {@link KoreanToken Korean token}.
 */
export const enum KoreanPos {
  // Word leved POS
  Noun = "Noun",
  Verb = "Verb",
  Adjective = "Adjective",
  Adverb = "Adverb",
  Determiner = "Determiner",
  Exclamation = "Exclamation",
  Josa = "Josa",
  Eomi = "Eomi",
  PreEomi = "PreEomi",
  Conjunction = "Conjunction",
  Modifier = "Modifier",
  VerbPrefix = "VerbPrefix",
  Suffix = "Suffix",
  Unknown = "Unknown",

  // Chunk level POS
  Korean = "Korean",
  Foreign = "Foreign",
  Number = "Number",
  KoreanParticle = "KoreanParticle",
  Alpha = "Alpha",
  Punctuation = "Punctuation",
  Hashtag = "Hashtag",
  ScreenName = "ScreenName",
  Email = "Email",
  URL = "URL",
  CashTag = "CashTag",

  // Functional POS
  Space = "Space",
  Others = "Others",
}

/**
 * A token extracted by {@link tokenize}.
 */
export interface KoreanToken<Pos extends KoreanPos = KoreanPos> {
  /**
   * Korean {@link KoreanPos part-of-speech}.
   */
  readonly pos: Pos;
  /**
   * The text which makes up the token.
   */
  readonly text: string;
  /**
   * The offset from the start of the input string where the token starts.
   */
  readonly offset: number;
  /**
   * The length of the token, equivalent to `text.length`.
   */
  readonly length: number;
  /**
   * The stem of the adjective, adverb, or verb represented by the token.
   */
  readonly stem: Pos extends
    KoreanPos.Adjective | KoreanPos.Adverb | KoreanPos.Verb
    ? string | undefined
    : undefined;
}

/**
 * A sentence extracted by {@link splitSentences}.
 */
export interface KoreanSentence {
  /**
   * The text which makes up the sentence.
   */
  readonly text: string;
  /**
   * The offset from the start of the input string where the sentence starts.
   */
  readonly offset: number;
  /**
   * The length of the sentence, equivalent to `text.length`.
   */
  readonly length: number;
}

/**
 * A phrase extracted by {@link extractPhrases}.
 */
export interface KoreanPhrase {
  /**
   * The {@link KoreanToken tokens} making up the phrase.
   */
  readonly tokens: KoreanToken[];
  /**
   * The {@link KoreanPos part-of-speech} of the phrase in its sentence.
   */
  readonly pos: KoreanPos;
  /**
   * The text which makes up the phrase, equal to the concatenation of all of
   * its tokens.
   */
  readonly text: string;
  /**
   * The offset from the start of the input string where the phrase starts.
   */
  readonly offset: number;
  /**
   * The length of the phrase, equivalent to `text.length`.
   */
  readonly length: number;
}

/**
 * Options given to {@link extractPhrases}.
 */
export interface ExtractPhrasesOptions {
  readonly filterSpam?: boolean;
  readonly enableHashtags?: boolean;
}

/**
 * Initializes the Open Korean Text API.
 *
 * Calling this function is not necessary as the initialization will be
 * performed automatically, but some users may wish to initialize the API
 * when they choose to do so.
 */
export function init(): void;

/**
 * Normalizes the given text for further processing by e.g.
 * {@link tokenize}.
 */
export function normalize(text: string): string;

/**
 * Tokenizes the given text into a sequence of {@link KoreanToken tokens},
 * which include {@link KoreanPos part-of-speech} information.
 */
export function tokenize(text: string): KoreanToken[];

/**
 * Same as {@link tokenize}, but returns the top `n` candidates instead of
 * the single best candidate.
 */
export function tokenizeTopN(text: string, n: number): KoreanToken[][];

/**
 * Transforms a list of strings back into a string.
 */
export function detokenize(tokens: Iterable<string>): string;

/**
 * Splits the given text into a sequence of
 * {@link KoreanSentence sentences}.
 */
export function splitSentences(text: string): KoreanSentence[];

/**
 * Extracts the {@link KoreanPhrase phrases} in the given text.
 */
export function extractPhrases(
  text: string,
  options?: ExtractPhrasesOptions,
): KoreanPhrase[];

/**
 * Extracts the {@link KoreanPhrase phrases} in the given
 * {@link KoreanToken tokens}.
 */
export function extractPhrases(
  tokens: Iterable<KoreanToken>,
  options?: ExtractPhrasesOptions,
): KoreanPhrase[];
````

## File: LICENSE
````
Apache License
                           Version 2.0, January 2004
                        http://www.apache.org/licenses/

   TERMS AND CONDITIONS FOR USE, REPRODUCTION, AND DISTRIBUTION

   1. Definitions.

      "License" shall mean the terms and conditions for use, reproduction,
      and distribution as defined by Sections 1 through 9 of this document.

      "Licensor" shall mean the copyright owner or entity authorized by
      the copyright owner that is granting the License.

      "Legal Entity" shall mean the union of the acting entity and all
      other entities that control, are controlled by, or are under common
      control with that entity. For the purposes of this definition,
      "control" means (i) the power, direct or indirect, to cause the
      direction or management of such entity, whether by contract or
      otherwise, or (ii) ownership of fifty percent (50%) or more of the
      outstanding shares, or (iii) beneficial ownership of such entity.

      "You" (or "Your") shall mean an individual or Legal Entity
      exercising permissions granted by this License.

      "Source" form shall mean the preferred form for making modifications,
      including but not limited to software source code, documentation
      source, and configuration files.

      "Object" form shall mean any form resulting from mechanical
      transformation or translation of a Source form, including but
      not limited to compiled object code, generated documentation,
      and conversions to other media types.

      "Work" shall mean the work of authorship, whether in Source or
      Object form, made available under the License, as indicated by a
      copyright notice that is included in or attached to the work
      (an example is provided in the Appendix below).

      "Derivative Works" shall mean any work, whether in Source or Object
      form, that is based on (or derived from) the Work and for which the
      editorial revisions, annotations, elaborations, or other modifications
      represent, as a whole, an original work of authorship. For the purposes
      of this License, Derivative Works shall not include works that remain
      separable from, or merely link (or bind by name) to the interfaces of,
      the Work and Derivative Works thereof.

      "Contribution" shall mean any work of authorship, including
      the original version of the Work and any modifications or additions
      to that Work or Derivative Works thereof, that is intentionally
      submitted to Licensor for inclusion in the Work by the copyright owner
      or by an individual or Legal Entity authorized to submit on behalf of
      the copyright owner. For the purposes of this definition, "submitted"
      means any form of electronic, verbal, or written communication sent
      to the Licensor or its representatives, including but not limited to
      communication on electronic mailing lists, source code control systems,
      and issue tracking systems that are managed by, or on behalf of, the
      Licensor for the purpose of discussing and improving the Work, but
      excluding communication that is conspicuously marked or otherwise
      designated in writing by the copyright owner as "Not a Contribution."

      "Contributor" shall mean Licensor and any individual or Legal Entity
      on behalf of whom a Contribution has been received by Licensor and
      subsequently incorporated within the Work.

   2. Grant of Copyright License. Subject to the terms and conditions of
      this License, each Contributor hereby grants to You a perpetual,
      worldwide, non-exclusive, no-charge, royalty-free, irrevocable
      copyright license to reproduce, prepare Derivative Works of,
      publicly display, publicly perform, sublicense, and distribute the
      Work and such Derivative Works in Source or Object form.

   3. Grant of Patent License. Subject to the terms and conditions of
      this License, each Contributor hereby grants to You a perpetual,
      worldwide, non-exclusive, no-charge, royalty-free, irrevocable
      (except as stated in this section) patent license to make, have made,
      use, offer to sell, sell, import, and otherwise transfer the Work,
      where such license applies only to those patent claims licensable
      by such Contributor that are necessarily infringed by their
      Contribution(s) alone or by combination of their Contribution(s)
      with the Work to which such Contribution(s) was submitted. If You
      institute patent litigation against any entity (including a
      cross-claim or counterclaim in a lawsuit) alleging that the Work
      or a Contribution incorporated within the Work constitutes direct
      or contributory patent infringement, then any patent licenses
      granted to You under this License for that Work shall terminate
      as of the date such litigation is filed.

   4. Redistribution. You may reproduce and distribute copies of the
      Work or Derivative Works thereof in any medium, with or without
      modifications, and in Source or Object form, provided that You
      meet the following conditions:

      (a) You must give any other recipients of the Work or
          Derivative Works a copy of this License; and

      (b) You must cause any modified files to carry prominent notices
          stating that You changed the files; and

      (c) You must retain, in the Source form of any Derivative Works
          that You distribute, all copyright, patent, trademark, and
          attribution notices from the Source form of the Work,
          excluding those notices that do not pertain to any part of
          the Derivative Works; and

      (d) If the Work includes a "NOTICE" text file as part of its
          distribution, then any Derivative Works that You distribute must
          include a readable copy of the attribution notices contained
          within such NOTICE file, excluding those notices that do not
          pertain to any part of the Derivative Works, in at least one
          of the following places: within a NOTICE text file distributed
          as part of the Derivative Works; within the Source form or
          documentation, if provided along with the Derivative Works; or,
          within a display generated by the Derivative Works, if and
          wherever such third-party notices normally appear. The contents
          of the NOTICE file are for informational purposes only and
          do not modify the License. You may add Your own attribution
          notices within Derivative Works that You distribute, alongside
          or as an addendum to the NOTICE text from the Work, provided
          that such additional attribution notices cannot be construed
          as modifying the License.

      You may add Your own copyright statement to Your modifications and
      may provide additional or different license terms and conditions
      for use, reproduction, or distribution of Your modifications, or
      for any such Derivative Works as a whole, provided Your use,
      reproduction, and distribution of the Work otherwise complies with
      the conditions stated in this License.

   5. Submission of Contributions. Unless You explicitly state otherwise,
      any Contribution intentionally submitted for inclusion in the Work
      by You to the Licensor shall be under the terms and conditions of
      this License, without any additional terms or conditions.
      Notwithstanding the above, nothing herein shall supersede or modify
      the terms of any separate license agreement you may have executed
      with Licensor regarding such Contributions.

   6. Trademarks. This License does not grant permission to use the trade
      names, trademarks, service marks, or product names of the Licensor,
      except as required for reasonable and customary use in describing the
      origin of the Work and reproducing the content of the NOTICE file.

   7. Disclaimer of Warranty. Unless required by applicable law or
      agreed to in writing, Licensor provides the Work (and each
      Contributor provides its Contributions) on an "AS IS" BASIS,
      WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
      implied, including, without limitation, any warranties or conditions
      of TITLE, NON-INFRINGEMENT, MERCHANTABILITY, or FITNESS FOR A
      PARTICULAR PURPOSE. You are solely responsible for determining the
      appropriateness of using or redistributing the Work and assume any
      risks associated with Your exercise of permissions under this License.

   8. Limitation of Liability. In no event and under no legal theory,
      whether in tort (including negligence), contract, or otherwise,
      unless required by applicable law (such as deliberate and grossly
      negligent acts) or agreed to in writing, shall any Contributor be
      liable to You for damages, including any direct, indirect, special,
      incidental, or consequential damages of any character arising as a
      result of this License or out of the use or inability to use the
      Work (including but not limited to damages for loss of goodwill,
      work stoppage, computer failure or malfunction, or any and all
      other commercial damages or losses), even if such Contributor
      has been advised of the possibility of such damages.

   9. Accepting Warranty or Additional Liability. While redistributing
      the Work or Derivative Works thereof, You may choose to offer,
      and charge a fee for, acceptance of support, warranty, indemnity,
      or other liability obligations and/or rights consistent with this
      License. However, in accepting such obligations, You may act only
      on Your own behalf and on Your sole responsibility, not on behalf
      of any other Contributor, and only if You agree to indemnify,
      defend, and hold each Contributor harmless for any liability
      incurred by, or claims asserted against, such Contributor by reason
      of your accepting any such warranty or additional liability.

   END OF TERMS AND CONDITIONS

   Copyright 2022 Grégoire Geis

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
````

## File: package.json
````json
{
  "name": "oktjs",
  "version": "0.1.3",
  "description": "Open Korean Text ported to JavaScript.",
  "main": "./index.js",
  "types": "./index.d.ts",
  "type": "module",
  "repository": "https://github.com/71/oktjs.git",
  "author": "opensource@gregoirege.is",
  "license": "Apache-2.0",
  "scripts": {
    "build:resources": "node resources.json.gz.build.js",
    "build:scala": "sbt fullLinkJS",
    "build:lib": "esbuild src/index.js --outfile=index.js --format=esm --bundle --minify --loader:.gz=binary --inject:./resources.js",
    "build": "yarn build:resources && yarn build:scala && yarn build:lib",
    "test": "node example.js"
  },
  "devDependencies": {
    "@types/node": "^18.6.1",
    "esbuild": "^0.14.50",
    "fflate": "^0.7.3",
    "typescript": "^5.2.2"
  }
}
````

## File: README.md
````markdown
# oktjs

<a href="https://www.npmjs.com/package/oktjs" alt="npm">
  <img src="https://img.shields.io/npm/v/oktjs" />
</a>

Port of [Open Korean Text](https://github.com/open-korean-text/open-korean-text)
to JavaScript; it has no external dependencies, and runs in the browser.

Note that a modern browser with support for
[ES2018 RegExp unicode escapes](https://caniuse.com/mdn-javascript_builtins_regexp_property_escapes)
is [necessary](https://www.scala-js.org/doc/regular-expressions.html).

[Try it online](https://observablehq.com/@71/korean-nlp)!

## Building

To build Oktjs, the following must be installed:

- A JDK.
- [`sbt`](https://www.scala-sbt.org/) to compile the Scala code.
- [`yarn`](https://yarnpkg.com/) to fetch dependencies and bundle the JavaScript
  code.

Then, `yarn` can be used:

```bash
$ yarn build
```

## Details

Oktjs uses [Scala.js](https://www.scala-js.org/) to compile Open Korean Text to
JavaScript, so it is cloned as a submodule to use its sources. A few changes are
required to make it work with JavaScript:

- [`open-korean-text/src/main/scala/org/openkoreantext/processor/util/KoreanDictionaryProvider.scala`](open-korean-text/src/main/scala/org/openkoreantext/processor/util/KoreanDictionaryProvider.scala)
  is replaced by
  [a shim](src/main/scala/org/openkoreantext/processor/util/KoreanDictionaryProviderShim.scala).
  - The shim uses [`resources.js`](resources.js) instead of embedded resources
    to load dictionaries.
  - `resources.js` embeds `resources.json.gz` using
    [`esbuild`](https://esbuild.github.io/content-types/#binary).
  - `resources.json.gz` is generated by
    [`resources.json.gz.build.js`](resources.json.gz.build.js), which reads
    resources in
    [`open-korean-text/src/main/resources/org/openkoreantext/processor/util`](open-korean-text/src/main/resources/org/openkoreantext/processor/util)
    and writes them to a JSON file, which is then gzipped.
- [A minimal shim](src/main/scala/com/twitter/Regex.scala) of
  [Twitter Text](https://github.com/twitter/twitter-text) is provided.
- [A minimal shim](src/main/scala/org/openkoreantext/processor/util/CharArraySet.scala)
  of `CharArraySet` is provided.
- A Scala.js wrapper for the Open Korean Text API is written in
  [`Okt.scala`](src/main/scala/is/gregoirege/oktjs/Okt.scala) and then
  re-exported with types by [`index.ts`](index.ts).
````

## File: resources.js
````javascript
import { gunzipSync } from "fflate";
import resourcesBinary from "./resources.json.gz";

let files;

export const Resources = Object.freeze({
  get files() {
    if (files === undefined) {
      files = JSON.parse(new TextDecoder().decode(gunzipSync(resourcesBinary)));
    }

    return files;
  },
  read(/** @type string */ filename) {
    return this.files[filename];
  },
});
````

## File: resources.json.gz.build.js
````javascript
import { readdir, readFile, writeFile } from "fs/promises";
import { join, relative } from "path";
import { gunzipSync as gunzip, gzipSync as gzip } from "fflate";

const RESOURCES_DIR =
  "./open-korean-text/src/main/resources/org/openkoreantext/processor/util";
const OUTPUT_FILE =
  "./resources.json.gz";
const resources = {};

async function* walk(/** @type string */ path) {
  for (const entry of await readdir(path, { withFileTypes: true })) {
    const entryPath = join(path, entry.name);

    if (entry.isDirectory()) {
      yield* walk(entryPath);
    } else if (entry.isFile()) {
      yield entryPath;
    }
  }
}

for await (const path of walk(RESOURCES_DIR, { includeDirs: false })) {
  const resourcePath = relative(RESOURCES_DIR, path).replace("\\", "/");
  /** @type {string} */
  let contents;

  if (path.endsWith(".gz")) {
    const compressedContents = await readFile(path),
          uncompressedContents = gunzip(compressedContents);

    contents = new TextDecoder().decode(uncompressedContents);
  } else {
    contents = await readFile(path, { encoding: "utf-8" });
  }

  resources[resourcePath] = contents;
}

await writeFile(OUTPUT_FILE, gzip(new TextEncoder().encode(JSON.stringify(resources))));
````
