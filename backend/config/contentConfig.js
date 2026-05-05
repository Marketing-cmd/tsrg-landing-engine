/**
 * CONTENT CONTROL PANEL FOR TSRG LANDING PAGES
 *
 * 1. This is the only file a non-developer should edit for landing page content.
 * 2. To add a new campaign, copy one campaign block inside `campaigns`, paste it, and change the key.
 * 3. For a quick 6th campaign, change these five strings first: key, utmMatch, hero.h1, hero.subheadline, form.headline.
 * 4. The campaign key should match the usual `utm_campaign` value, such as `luxury-condos`.
 * 5. Add campaign aliases in `utmMatch` so values like `senior` can resolve to `senior-downsizing`.
 * 6. Use `{{term}}` anywhere you want the landing page to insert `utm_term`.
 * 7. If `utm_term` is missing, the resolver uses the first value in `neighborhoodFallbacks`.
 * 8. Change default neighborhoods by editing the `neighborhoodFallbacks` array below.
 * 9. To add a form field, add an object to `form.fields` with name, type, label, required, and optional options.
 * 10. Supported field types are text, email, tel, select, textarea, and hidden.
 * 11. Hidden UTM fields are filled automatically by the template and frontend scripts.
 * 12. To swap a hero image, drop the file into `public/assets/images/campaigns/YOUR-CAMPAIGN/`.
 * 13. Then update `hero.heroImage` to that filename, for example `family-home.jpg`.
 * 14. Shared files like logos and headshots can go in `public/assets/images/shared/`.
 * 15. Image lookup checks the campaign folder first, then shared, then a placeholder.
 * 16. Change campaign colors in each campaign's `colors` object.
 * 17. Change global fallback colors in the `default.colors` object or `siteConfig.js`.
 * 18. Use `ctaUrl: "#lead-form"` to scroll to the form, or an external URL for another destination.
 * 19. Use `ctaSecondaryUrl: "tel:+14165551234"` for phone CTAs or a PDF path for downloads.
 * 20. Server code and EJS templates read this object automatically, so no template edits are needed.
 */

module.exports = {
  defaultCampaign: 'default',

  neighborhoodFallbacks: [
    'West Toronto',
    'Etobicoke',
    'The Kingsway',
    'Islington',
    'Humber Valley',
    'Bloor West Village',
    'High Park'
  ],

  default: {
    intentSegment: 'general',
    meta: {
      title: 'Exclusive Foreclosure Access - TSRG',
      description: 'Get immediate access to off-market, foreclosure, and distressed property opportunities across Etobicoke and West Toronto.',
      ogImage: 'default-og.jpg'
    },
    hero: {
      h1: 'Exclusive Access: {{term}} Foreclosure and Distressed Property List',
      subheadline: 'Get immediate access to 14+ properties currently flagged across Etobicoke and West Toronto. Updated every 2 hours.',
      ctaText: 'Unlock Full Foreclosure List',
      ctaUrl: '#lead-form',
      ctaSecondaryText: 'Call Now',
      ctaSecondaryUrl: 'tel:+14165551234',
      heroImage: 'default-hero.jpg',
      agentPhoto: 'brian-smith.jpg',
      agentName: 'Brian Smith',
      agentTitle: 'Broker, SRES | The Smith Realty Group',
      stats: [
        { value: '400+', label: 'Homes Sold' },
        { value: '22 Yrs', label: 'Experience' },
        { value: '4.9★', label: 'Google Rating' },
        { value: '$2B+', label: 'Sales Volume' }
      ]
    },
    listingGate: {
      urgencyText: 'Exclusive Access: 14 New Foreclosures Added Today',
      navBrand: 'Premier Foreclosures',
      navCtaText: 'Call Now',
      navCtaUrl: 'tel:+14165551234',
      overlayCtaText: 'Unlock Full Foreclosure List',
      overlayCtaUrl: '#lead-form',
      formSecureNote: '100% secure and confidential. Your information is never shared.',
      footerBrand: 'The Smith Realty Group',
      footerLegal: 'All rights reserved.',
      consentText: 'I consent to receive text messages and emails from TSRG regarding foreclosure updates and real estate opportunities. Message and data rates may apply. Reply STOP to opt out.',
      cards: [
        {
          badge: 'Est. 30% Below Market Value',
          title: 'Etobicoke - Detached',
          details: ['4 Beds', '3 Baths'],
          image: 'foreclosure-detached.jpg',
          alt: 'A detached Etobicoke home preview with address details locked until form submission.'
        },
        {
          badge: 'Est. 30% Below Market Value',
          title: 'The Kingsway - Condo',
          details: ['2 Beds', '2 Baths'],
          image: 'foreclosure-condo.jpg',
          alt: 'A modern Kingsway condominium preview with address details locked until form submission.'
        },
        {
          badge: 'Est. 30% Below Market Value',
          title: 'Islington - Semi-Detached',
          details: ['3 Beds', '2 Baths'],
          image: 'foreclosure-semi.jpg',
          alt: 'A semi-detached Islington property preview with pricing details locked until form submission.'
        }
      ]
    },
    features: [
      {
        icon: 'location_on',
        title: 'Neighbourhood-level advice',
        description: 'Pricing, buyer demand, school zones, transit, and street-by-street context across West Toronto and Etobicoke.'
      },
      {
        icon: 'show_chart',
        title: 'Clear market strategy',
        description: 'A practical plan for timing, positioning, negotiation, and next steps so you are never guessing.'
      },
      {
        icon: 'home',
        title: 'Full-service support',
        description: 'From preparation and staging to offer review and closing coordination, the details are handled.'
      }
    ],
    socialProof: {
      headline: 'Trusted by West Toronto homeowners, buyers, and families in transition',
      testimonials: [
        {
          quote: 'Brian gave us calm, precise advice at every stage. We felt prepared before every decision.',
          author: 'M. Reynolds',
          location: 'Bloor West Village'
        },
        {
          quote: 'The pricing strategy was thoughtful, the marketing was polished, and the result exceeded our expectations.',
          author: 'A. Patel',
          location: 'Etobicoke'
        }
      ]
    },
    form: {
      headline: 'Request the Full PDF List and Address Details',
      subheadline: 'Fill out the form below to receive the instant download link and daily SMS alerts for new listings.',
      fields: [
        { name: 'name',       type: 'text',   label: 'Full name',         required: true },
        { name: 'phone',      type: 'tel',    label: 'Phone number',      required: true },
        { name: 'email',      type: 'email',  label: 'Email address',     required: true },
        { name: 'timeline',   type: 'select', label: 'Purchase timeline', required: false, options: ['Within 30 days', '1–3 months', '3–6 months', 'Just researching'] },
        { name: 'financing',  type: 'select', label: 'Financing status',  required: false, options: ['Pre-approved', 'Working on it', 'Cash buyer', 'Not sure yet'] },
        { name: 'consent',    type: 'checkbox', label: 'SMS and email consent', required: true },
        { name: 'interest',   type: 'hidden', label: 'Interest',      required: false, value: 'Foreclosure Access' },
        { name: 'neighborhood', type: 'hidden', label: 'Neighbourhood', required: false },
        { name: 'utm_source',   type: 'hidden', label: 'UTM Source',   required: false },
        { name: 'utm_medium',   type: 'hidden', label: 'UTM Medium',   required: false },
        { name: 'utm_campaign', type: 'hidden', label: 'UTM Campaign', required: false },
        { name: 'utm_term',     type: 'hidden', label: 'UTM Term',     required: false },
        { name: 'utm_content',  type: 'hidden', label: 'UTM Content',  required: false }
      ],
      submitText: 'Get Instant Access Now',
      successMessage: 'Your foreclosure access request has been received. Check your inbox — full list coming shortly.',
      nextSteps: [
        { icon: 'email',         text: 'Check your inbox — PDF list sent within 5 minutes' },
        { icon: 'phone_callback', text: 'Brian will personally follow up within 1 business day' },
        { icon: 'lock_open',     text: 'Address details and full property list now unlocking' }
      ]
    },
    colors: {
      primary: '#002444',
      secondary: '#745a27',
      accent: '#ba1a1a',
      text: '#1a1c1a',
      background: '#faf9f6'
    },
    trustBadges: ['Exclusive List Access', 'Etobicoke and West Toronto', 'Updated Every 2 Hours']
  },

  campaigns: {
    'foreclosure-access': {
      intentSegment: 'distressed-property-buyer',
      utmMatch: ['foreclosure-access', 'foreclosure', 'foreclosures', 'distressed', 'power-of-sale', 'bank-sale'],
      meta: {
        title: 'Exclusive {{term}} Foreclosure Access | TSRG',
        description: 'Unlock current foreclosure and distressed property opportunities in {{term}} and across West Toronto.',
        ogImage: 'foreclosure-access-og.jpg'
      },
      hero: {
        h1: 'Exclusive Access: {{term}} Foreclosure and Distressed Property List',
        subheadline: 'Get immediate access to locked property previews, address details, and new opportunity alerts for {{term}}.',
        ctaText: 'Unlock Full Foreclosure List',
        ctaUrl: '#lead-form',
        ctaSecondaryText: 'Call Now',
        ctaSecondaryUrl: 'tel:+14165551234',
        heroImage: 'foreclosure-access-hero.jpg'
      },
      listingGate: {
        urgencyText: 'Exclusive Access: 14 New {{term}} Opportunities Added Today',
        navBrand: 'Premier Foreclosures',
        overlayCtaText: 'Unlock Full Foreclosure List'
      },
      form: {
        headline: 'Request the Full PDF List and Address Details',
        subheadline: 'Fill out the form below to receive the instant download link and daily SMS alerts for new {{term}} listings.',
        fields: [
          { name: 'name',       type: 'text',   label: 'Full name',         required: true },
          { name: 'phone',      type: 'tel',    label: 'Phone number',      required: true },
          { name: 'email',      type: 'email',  label: 'Email address',     required: true },
          { name: 'timeline',   type: 'select', label: 'Purchase timeline', required: false, options: ['Within 30 days', '1–3 months', '3–6 months', 'Just researching'] },
          { name: 'financing',  type: 'select', label: 'Financing status',  required: false, options: ['Pre-approved', 'Working on it', 'Cash buyer', 'Not sure yet'] },
          { name: 'consent',    type: 'checkbox', label: 'SMS and email consent', required: true },
          { name: 'interest',   type: 'hidden', label: 'Interest',      required: false, value: 'Foreclosure Access' },
          { name: 'neighborhood', type: 'hidden', label: 'Neighbourhood', required: false },
          { name: 'utm_source',   type: 'hidden', label: 'UTM Source',   required: false },
          { name: 'utm_medium',   type: 'hidden', label: 'UTM Medium',   required: false },
          { name: 'utm_campaign', type: 'hidden', label: 'UTM Campaign', required: false },
          { name: 'utm_term',     type: 'hidden', label: 'UTM Term',     required: false },
          { name: 'utm_content',  type: 'hidden', label: 'UTM Content',  required: false }
        ],
        submitText: 'Get Instant Access Now',
        successMessage: 'Your foreclosure access request has been received. Check your inbox — full list coming shortly.',
        nextSteps: [
          { icon: 'email',         text: 'Check your inbox — PDF list sent within 5 minutes' },
          { icon: 'phone_callback', text: 'Brian will personally follow up within 1 business day' },
          { icon: 'lock_open',     text: 'Address details and full property list now unlocking' }
        ]
      },
      colors: {
        primary: '#002444',
        secondary: '#745a27',
        accent: '#ba1a1a',
        text: '#1a1c1a',
        background: '#faf9f6'
      },
      trustBadges: ['Foreclosure Access', 'Power of Sale Watchlist', 'West Toronto and Etobicoke'],
      dynamicInject: {
        h1: 'Exclusive Access: {{term}} Foreclosure and Distressed Property List',
        subheadline: 'Get immediate access to locked property previews, address details, and new opportunity alerts for {{term}}.'
      }
    },

    'senior-downsizing': {
      intentSegment: 'senior-prospect',
      utmMatch: ['senior-downsizing', 'senior', 'downsize', 'downsizing', 'sres'],
      meta: {
        title: 'Senior Downsizing Help in {{term}} | Brian Smith SRES',
        description: 'Compassionate downsizing guidance for seniors and families in {{term}}, Etobicoke, and West Toronto.',
        ogImage: 'senior-downsizing-og.jpg'
      },
      hero: {
        h1: 'Senior Moves Made Simple in {{term}}',
        subheadline: 'Compassionate real estate service for {{term}} residents, led by Brian Smith, SRES.',
        ctaText: 'Plan a Calm Downsizing Call',
        ctaUrl: '#lead-form',
        ctaSecondaryText: 'Speak With Brian',
        ctaSecondaryUrl: 'tel:+14165551234',
        heroImage: 'senior-downsizing-hero.jpg',
        agentPhoto: 'brian-smith.jpg',
        agentTitle: 'Broker, Seniors Real Estate Specialist'
      },
      features: [
        {
          icon: 'handshake',
          title: 'A patient, step-by-step process',
          description: 'We help families understand timing, preparation, pricing, possessions, and sale strategy without pressure.'
        },
        {
          icon: 'assignment_turned_in',
          title: 'Right-size with confidence',
          description: 'Get practical guidance on condos, retirement residences, accessibility, and neighbourhood fit.'
        },
        {
          icon: 'group',
          title: 'Family-friendly communication',
          description: 'We can coordinate conversations with adult children, trusted advisors, and service providers.'
        }
      ],
      socialProof: {
        headline: 'A steady hand for important family moves',
        testimonials: [
          {
            quote: 'Brian made a difficult transition feel manageable. He was respectful, organized, and incredibly patient.',
            author: 'D. Wilson',
            location: 'The Kingsway'
          },
          {
            quote: 'Our family always knew what was happening next. That clarity made all the difference.',
            author: 'L. Martin',
            location: 'Etobicoke'
          }
        ]
      },
      form: {
        headline: 'Start with a no-pressure downsizing conversation',
        subheadline: 'Tell us where you are in the process and we will help you map the next few steps.',
        fields: [
          { name: 'name',             type: 'text',   label: 'Full name',         required: true },
          { name: 'phone',            type: 'tel',    label: 'Phone number',      required: true },
          { name: 'email',            type: 'email',  label: 'Email address',     required: true },
          { name: 'selling_timeline', type: 'select', label: 'Move timeline',     required: false, options: ['Within 30 days', '1–3 months', '3–6 months', 'No firm date'] },
          { name: 'situation',        type: 'select', label: 'Who is moving?',    required: false, options: ['Myself / My partner', 'A parent', 'Other family member'] },
          { name: 'consent',          type: 'checkbox', label: 'SMS and email consent', required: true },
          { name: 'interest',         type: 'hidden', label: 'Interest',      required: false, value: 'Senior Downsizing' },
          { name: 'neighborhood',     type: 'hidden', label: 'Neighbourhood', required: false },
          { name: 'utm_source',       type: 'hidden', label: 'UTM Source',   required: false },
          { name: 'utm_medium',       type: 'hidden', label: 'UTM Medium',   required: false },
          { name: 'utm_campaign',     type: 'hidden', label: 'UTM Campaign', required: false },
          { name: 'utm_term',         type: 'hidden', label: 'UTM Term',     required: false },
          { name: 'utm_content',      type: 'hidden', label: 'UTM Content',  required: false }
        ],
        submitText: 'Request Downsizing Guidance',
        successMessage: 'Your downsizing guidance request has been received. A calm, no-pressure conversation awaits.',
        nextSteps: [
          { icon: 'email',          text: 'Check your inbox — a personalized overview is on the way' },
          { icon: 'phone_callback', text: 'Brian will reach out within 1 business day at your pace' },
          { icon: 'handshake',      text: 'No pressure — you set the timeline and the level of detail' }
        ]
      },
      listingGate: {
        urgencyText: 'Senior Move Planning Appointments Available This Week',
        navBrand: 'TSRG Senior Moves',
        overlayCtaText: 'Start My Downsizing Plan',
        consentText: 'I consent to receive text messages and emails from TSRG regarding senior downsizing guidance and real estate opportunities. Message and data rates may apply. Reply STOP to opt out.',
        cards: [
          {
            badge: 'SRES Guided',
            title: '{{term}} Downsizing Plan',
            details: ['Timeline', 'Family Coordination'],
            image: 'senior-plan.jpg',
            alt: 'A locked preview of a senior downsizing plan.'
          },
          {
            badge: 'Local Options',
            title: 'Condo and Right-Size Search',
            details: ['Accessibility', 'Neighbourhood Fit'],
            image: 'senior-condo.jpg',
            alt: 'A locked preview of right-size housing options.'
          },
          {
            badge: 'Home Sale Prep',
            title: 'Sale and Transition Strategy',
            details: ['Pricing', 'Preparation'],
            image: 'senior-sale.jpg',
            alt: 'A locked preview of a senior home sale strategy.'
          }
        ]
      },
      colors: {
        primary: '#35635b',
        secondary: '#243533',
        accent: '#b4874d',
        text: '#20302e',
        background: '#fbfaf7'
      },
      trustBadges: ['SRES Certified', 'Family Transition Planning', 'Etobicoke and West Toronto'],
      dynamicInject: {
        h1: 'Senior Moves Made Simple in {{term}}',
        subheadline: 'Compassionate real estate service for {{term}} residents'
      }
    },

    'investment-buyers': {
      intentSegment: 'investor',
      utmMatch: ['investment-buyers', 'investor', 'investment', 'income-property', 'rental'],
      meta: {
        title: 'Toronto Investment Property Guidance | TSRG',
        description: 'Find and evaluate income properties, condos, and long-term real estate opportunities in West Toronto and Etobicoke.',
        ogImage: 'investment-buyers-og.jpg'
      },
      hero: {
        h1: 'Find Investment Properties With Better Local Context',
        subheadline: 'Compare rent potential, resale fundamentals, and neighbourhood demand before you write an offer.',
        ctaText: 'Get Investor Listings',
        ctaUrl: '#lead-form',
        ctaSecondaryText: 'Download Buyer Checklist',
        ctaSecondaryUrl: '/assets/pdfs/investor-checklist.pdf',
        heroImage: 'investment-buyers-hero.jpg'
      },
      features: [
        {
          icon: 'calculate',
          title: 'Numbers-first shortlists',
          description: 'Review price, rent assumptions, carrying costs, and exit strategy before falling in love with a property.'
        },
        {
          icon: 'apartment',
          title: 'Condo and multiplex insight',
          description: 'Understand building reputation, maintenance fees, rentability, suite layout, and long-term buyer appeal.'
        },
        {
          icon: 'trending_up',
          title: 'Neighbourhood demand signals',
          description: 'Look at transit, employment nodes, schools, and rental demand across West Toronto and Etobicoke.'
        }
      ],
      form: {
        headline: 'Tell us your investment criteria',
        subheadline: 'We will help you identify opportunities that fit your budget, timeline, and risk profile.',
        fields: [
          { name: 'name',      type: 'text',   label: 'Full name',          required: true },
          { name: 'phone',     type: 'tel',    label: 'Phone number',       required: true },
          { name: 'email',     type: 'email',  label: 'Email address',      required: true },
          { name: 'budget',    type: 'select', label: 'Investment budget',  required: false, options: ['Under $500K', '$500K–$800K', '$800K–$1.2M', 'Over $1.2M'] },
          { name: 'financing', type: 'select', label: 'Financing approach', required: false, options: ['Cash buyer', 'Pre-approved', 'Need financing'] },
          { name: 'consent',   type: 'checkbox', label: 'SMS and email consent', required: true },
          { name: 'interest',     type: 'hidden', label: 'Interest',      required: false, value: 'Investment Buyers' },
          { name: 'neighborhood', type: 'hidden', label: 'Neighbourhood', required: false },
          { name: 'utm_source',   type: 'hidden', label: 'UTM Source',   required: false },
          { name: 'utm_medium',   type: 'hidden', label: 'UTM Medium',   required: false },
          { name: 'utm_campaign', type: 'hidden', label: 'UTM Campaign', required: false },
          { name: 'utm_term',     type: 'hidden', label: 'UTM Term',     required: false },
          { name: 'utm_content',  type: 'hidden', label: 'UTM Content',  required: false }
        ],
        submitText: 'Send Me Investor Opportunities',
        successMessage: 'Your investor opportunity request has been received. Shortlisting properties that match your criteria.',
        nextSteps: [
          { icon: 'email',          text: 'Check your inbox — curated shortlist on the way' },
          { icon: 'phone_callback', text: 'Brian will review your criteria and follow up within 1 business day' },
          { icon: 'calculate',      text: 'Numbers-first property reviews included in your package' }
        ]
      },
      listingGate: {
        urgencyText: 'New West Toronto Investment Opportunities Added Today',
        navBrand: 'TSRG Investor Access',
        overlayCtaText: 'Get Investor Opportunities',
        consentText: 'I consent to receive text messages and emails from TSRG regarding investment property opportunities and real estate updates. Message and data rates may apply. Reply STOP to opt out.',
        cards: [
          {
            badge: 'Income Potential',
            title: 'Etobicoke - Condo Rental',
            details: ['2 Beds', 'Rent Review'],
            image: 'investor-condo.jpg',
            alt: 'A locked preview of a condo investment opportunity.'
          },
          {
            badge: 'Multiplex Watch',
            title: 'West Toronto - Duplex',
            details: ['2 Units', 'Value-Add'],
            image: 'investor-duplex.jpg',
            alt: 'A locked preview of a duplex investment opportunity.'
          },
          {
            badge: 'Long-Term Hold',
            title: 'Bloor West - Townhome',
            details: ['3 Beds', 'Transit Access'],
            image: 'investor-townhome.jpg',
            alt: 'A locked preview of a townhome investment opportunity.'
          }
        ]
      },
      colors: {
        primary: '#244f7a',
        secondary: '#132236',
        accent: '#2f9e83',
        text: '#17202a',
        background: '#f8fbfc'
      },
      trustBadges: ['Investment Search Strategy', 'Condo Market Insight', 'West Toronto and Etobicoke']
    },

    'first-time-buyer': {
      intentSegment: 'high-intent-buyer',
      utmMatch: ['first-time-buyer', 'first-time', 'firstbuyer', 'buyer', 'starter-home'],
      meta: {
        title: 'First-Time Buyer Help in {{term}} | The Smith Realty Group',
        description: 'A clear, practical path to buying your first home in {{term}}, West Toronto, or Etobicoke.',
        ogImage: 'first-time-buyer-og.jpg'
      },
      hero: {
        h1: 'Buy Your First Home in {{term}} With a Clear Plan',
        subheadline: 'Learn what you can afford, where to focus, and how to compete without feeling rushed.',
        ctaText: 'Build My Buyer Plan',
        ctaUrl: '#lead-form',
        ctaSecondaryText: 'Call About Buying',
        ctaSecondaryUrl: 'tel:+14165551234',
        heroImage: 'first-time-buyer-hero.jpg'
      },
      features: [
        {
          icon: 'wallet',
          title: 'Budget clarity before showings',
          description: 'Understand down payment, land transfer tax, monthly costs, and offer deposits before you tour.'
        },
        {
          icon: 'search',
          title: 'Neighbourhood fit',
          description: 'Compare homes, condos, commutes, parks, schools, and lifestyle trade-offs in plain language.'
        },
        {
          icon: 'draw',
          title: 'Offer confidence',
          description: 'Get guidance on conditions, deposits, price strategy, and what each document actually means.'
        }
      ],
      form: {
        headline: 'Start your first-home roadmap',
        subheadline: 'Tell us your budget range and preferred area, and we will help you shape the next step.',
        fields: [
          { name: 'name',      type: 'text',   label: 'Full name',          required: true },
          { name: 'phone',     type: 'tel',    label: 'Phone number',       required: true },
          { name: 'email',     type: 'email',  label: 'Email address',      required: true },
          { name: 'budget',    type: 'select', label: 'Target budget',      required: false, options: ['Under $600K', '$600K–$800K', '$800K–$1M', 'Over $1M'] },
          { name: 'financing', type: 'select', label: 'Pre-approval status', required: false, options: ['Pre-approved', 'Working on it', 'Need to start'] },
          { name: 'timeline',  type: 'select', label: 'Purchase timeline',  required: false, options: ['Within 30 days', '1–3 months', '3–6 months', 'Just starting out'] },
          { name: 'consent',   type: 'checkbox', label: 'SMS and email consent', required: true },
          { name: 'interest',     type: 'hidden', label: 'Interest',      required: false, value: 'First Time Buyer' },
          { name: 'neighborhood', type: 'hidden', label: 'Neighbourhood', required: false },
          { name: 'utm_source',   type: 'hidden', label: 'UTM Source',   required: false },
          { name: 'utm_medium',   type: 'hidden', label: 'UTM Medium',   required: false },
          { name: 'utm_campaign', type: 'hidden', label: 'UTM Campaign', required: false },
          { name: 'utm_term',     type: 'hidden', label: 'UTM Term',     required: false },
          { name: 'utm_content',  type: 'hidden', label: 'UTM Content',  required: false }
        ],
        submitText: 'Create My Buyer Roadmap',
        successMessage: 'Your first-home roadmap request has been received. A clear, jargon-free plan is coming your way.',
        nextSteps: [
          { icon: 'email',          text: 'Check your inbox — your buyer roadmap overview is on the way' },
          { icon: 'phone_callback', text: 'Brian will call within 1 business day to walk through next steps' },
          { icon: 'draw',           text: 'No pressure — your roadmap is yours to act on at your own pace' }
        ]
      },
      listingGate: {
        urgencyText: 'New First-Time Buyer Matches Available in {{term}}',
        navBrand: 'TSRG Buyer Roadmap',
        overlayCtaText: 'Build My Buyer Plan',
        consentText: 'I consent to receive text messages and emails from TSRG regarding first-time buyer guidance and real estate opportunities. Message and data rates may apply. Reply STOP to opt out.',
        cards: [
          {
            badge: 'Starter Match',
            title: '{{term}} - Condo',
            details: ['1-2 Beds', 'First-Time Fit'],
            image: 'buyer-condo.jpg',
            alt: 'A locked preview of a first-time buyer condo match.'
          },
          {
            badge: 'Family Starter',
            title: 'West Toronto - Townhome',
            details: ['2 Beds', 'Transit Nearby'],
            image: 'buyer-townhome.jpg',
            alt: 'A locked preview of a first-time buyer townhome match.'
          },
          {
            badge: 'Offer Ready',
            title: 'Etobicoke - Semi',
            details: ['3 Beds', 'Budget Review'],
            image: 'buyer-semi.jpg',
            alt: 'A locked preview of a first-time buyer semi-detached match.'
          }
        ]
      },
      colors: {
        primary: '#176b87',
        secondary: '#1b2d33',
        accent: '#f0a202',
        text: '#17202a',
        background: '#f7fbfc'
      },
      trustBadges: ['First-Time Buyer Guidance', 'Offer Strategy', 'West Toronto Specialist'],
      dynamicInject: {
        h1: 'Buy Your First Home in {{term}} With a Clear Plan',
        subheadline: 'A practical first-time buyer roadmap for {{term}} and nearby West Toronto neighbourhoods.'
      }
    },

    seller: {
      intentSegment: 'seller',
      utmMatch: ['seller', 'selling', 'list-my-home', 'home-seller', 'west-toronto-seller'],
      meta: {
        title: 'Sell Your Home in {{term}} | The Smith Realty Group',
        description: 'A polished pricing, preparation, and marketing plan for homeowners selling in {{term}} and West Toronto.',
        ogImage: 'seller-og.jpg'
      },
      hero: {
        h1: 'Sell Your {{term}} Home With a Sharper Strategy',
        subheadline: 'Position your home with local pricing intelligence, premium marketing, and careful negotiation.',
        ctaText: 'Request a Selling Plan',
        ctaUrl: '#lead-form',
        ctaSecondaryText: 'Call About Selling',
        ctaSecondaryUrl: 'tel:+14165551234',
        heroImage: 'seller-hero.jpg'
      },
      features: [
        {
          icon: 'auto_awesome',
          title: 'Preparation that protects value',
          description: 'Prioritize the repairs, staging, photography, and presentation details most likely to move the sale price.'
        },
        {
          icon: 'bar_chart',
          title: 'Pricing built from local evidence',
          description: 'Review comparable sales, competing inventory, buyer behaviour, and timing before going live.'
        },
        {
          icon: 'campaign',
          title: 'Marketing made for qualified buyers',
          description: 'Reach active buyers with strong visuals, listing copy, digital campaigns, and agent-to-agent exposure.'
        }
      ],
      form: {
        headline: 'Get a custom selling plan',
        subheadline: 'Share your address or neighbourhood and Brian will outline realistic next steps.',
        fields: [
          { name: 'name',             type: 'text',   label: 'Full name',           required: true },
          { name: 'phone',            type: 'tel',    label: 'Phone number',        required: true },
          { name: 'email',            type: 'email',  label: 'Email address',       required: true },
          { name: 'property_address', type: 'text',   label: 'Property address (optional)', required: false },
          { name: 'selling_timeline', type: 'select', label: 'Selling timeline',    required: false, options: ['Within 30 days', '1–3 months', '3–6 months', 'No firm date'] },
          { name: 'already_listed',   type: 'select', label: 'Listing status',      required: false, options: ['No, not listed yet', 'Yes, currently listed', 'Was listed, now expired'] },
          { name: 'consent',          type: 'checkbox', label: 'SMS and email consent', required: true },
          { name: 'interest',         type: 'hidden', label: 'Interest',      required: false, value: 'Seller' },
          { name: 'neighborhood',     type: 'hidden', label: 'Neighbourhood', required: false },
          { name: 'utm_source',       type: 'hidden', label: 'UTM Source',   required: false },
          { name: 'utm_medium',       type: 'hidden', label: 'UTM Medium',   required: false },
          { name: 'utm_campaign',     type: 'hidden', label: 'UTM Campaign', required: false },
          { name: 'utm_term',         type: 'hidden', label: 'UTM Term',     required: false },
          { name: 'utm_content',      type: 'hidden', label: 'UTM Content',  required: false }
        ],
        submitText: 'Request My Selling Plan',
        successMessage: 'Your selling plan request has been received. A strategy tailored to your property is on the way.',
        nextSteps: [
          { icon: 'email',          text: 'Check your inbox — a preliminary market overview is on the way' },
          { icon: 'phone_callback', text: 'Brian will call within 1 business day to discuss your timeline' },
          { icon: 'bar_chart',      text: 'Your comparative market analysis will be ready within 48 hours' }
        ]
      },
      listingGate: {
        urgencyText: 'New {{term}} Seller Market Signals Updated Today',
        navBrand: 'TSRG Seller Strategy',
        overlayCtaText: 'Request My Selling Plan',
        consentText: 'I consent to receive text messages and emails from TSRG regarding selling strategy, market updates, and real estate opportunities. Message and data rates may apply. Reply STOP to opt out.',
        cards: [
          {
            badge: 'Pricing Signal',
            title: '{{term}} Comparable Sales',
            details: ['Recent Sales', 'Buyer Demand'],
            image: 'seller-comps.jpg',
            alt: 'A locked preview of seller comparable sales.'
          },
          {
            badge: 'Prep Priority',
            title: 'Listing Prep Checklist',
            details: ['Staging', 'Repairs'],
            image: 'seller-prep.jpg',
            alt: 'A locked preview of listing preparation priorities.'
          },
          {
            badge: 'Launch Plan',
            title: 'Marketing Strategy',
            details: ['Digital Campaign', 'Agent Network'],
            image: 'seller-marketing.jpg',
            alt: 'A locked preview of a seller marketing strategy.'
          }
        ]
      },
      colors: {
        primary: '#7b2d26',
        secondary: '#202124',
        accent: '#d1a85b',
        text: '#1f2328',
        background: '#fffaf7'
      },
      trustBadges: ['Pricing Strategy', 'Premium Listing Marketing', 'West Toronto Seller Representation'],
      dynamicInject: {
        h1: 'Sell Your {{term}} Home With a Sharper Strategy',
        subheadline: 'A local pricing and marketing plan for homeowners in {{term}}.'
      }
    },

    'home-evaluation': {
      intentSegment: 'valuation',
      utmMatch: ['home-evaluation', 'valuation', 'home-value', 'whats-my-home-worth', 'market-report'],
      meta: {
        title: 'What Is Your {{term}} Home Worth? | TSRG',
        description: 'Request a thoughtful, local home value estimate from The Smith Realty Group.',
        ogImage: 'home-evaluation-og.jpg'
      },
      hero: {
        h1: 'What Is Your {{term}} Home Worth Right Now?',
        subheadline: 'Get a local estimate based on comparable sales, buyer demand, and your home’s specific condition.',
        ctaText: 'Request My Home Value',
        ctaUrl: '#lead-form',
        ctaSecondaryText: 'Call for a Quick Opinion',
        ctaSecondaryUrl: 'tel:+14165551234',
        heroImage: 'home-evaluation-hero.jpg'
      },
      features: [
        {
          icon: 'assignment',
          title: 'More than an automated estimate',
          description: 'We look at finish quality, layout, lot, location, and current buyer demand.'
        },
        {
          icon: 'schedule',
          title: 'Useful even before you sell',
          description: 'Understand whether to renovate, wait, rent, or prepare based on realistic market context.'
        },
        {
          icon: 'my_location',
          title: 'Local comparable sales',
          description: 'See the recent sales that matter most and how your home compares.'
        }
      ],
      form: {
        headline: 'Request your home value estimate',
        subheadline: 'Share your contact details and neighbourhood. An address helps, but it is optional.',
        fields: [
          { name: 'name',             type: 'text',   label: 'Full name',            required: true },
          { name: 'phone',            type: 'tel',    label: 'Phone number',         required: true },
          { name: 'email',            type: 'email',  label: 'Email address',        required: true },
          { name: 'property_address', type: 'text',   label: 'Property address (optional)', required: false },
          { name: 'bedrooms',         type: 'select', label: 'Bedrooms',             required: false, options: ['1–2 bedrooms', '3 bedrooms', '4 bedrooms', '5+ bedrooms'] },
          { name: 'reason',           type: 'select', label: 'Reason for valuation', required: false, options: ['Planning to sell soon', 'Just curious about value', 'Estate planning', 'Renovation decision'] },
          { name: 'consent',          type: 'checkbox', label: 'SMS and email consent', required: true },
          { name: 'interest',         type: 'hidden', label: 'Interest',      required: false, value: 'Home Evaluation' },
          { name: 'neighborhood',     type: 'hidden', label: 'Neighbourhood', required: false },
          { name: 'utm_source',       type: 'hidden', label: 'UTM Source',   required: false },
          { name: 'utm_medium',       type: 'hidden', label: 'UTM Medium',   required: false },
          { name: 'utm_campaign',     type: 'hidden', label: 'UTM Campaign', required: false },
          { name: 'utm_term',         type: 'hidden', label: 'UTM Term',     required: false },
          { name: 'utm_content',      type: 'hidden', label: 'UTM Content',  required: false }
        ],
        submitText: 'Send My Valuation Request',
        successMessage: 'Your home valuation request has been received. A thoughtful local estimate is being prepared.',
        nextSteps: [
          { icon: 'email',          text: 'Check your inbox — comparable sales overview coming shortly' },
          { icon: 'phone_callback', text: 'Brian will call within 1 business day to review the numbers' },
          { icon: 'my_location',    text: 'Your estimate includes recent sales within 500m of your property' }
        ]
      },
      listingGate: {
        urgencyText: 'Updated {{term}} Home Value Reports Available Today',
        navBrand: 'TSRG Home Value',
        overlayCtaText: 'Request My Home Value',
        consentText: 'I consent to receive text messages and emails from TSRG regarding home value updates and real estate opportunities. Message and data rates may apply. Reply STOP to opt out.',
        cards: [
          {
            badge: 'Local Estimate',
            title: '{{term}} Value Range',
            details: ['Comparable Sales', 'Demand'],
            image: 'valuation-range.jpg',
            alt: 'A locked preview of a home valuation range.'
          },
          {
            badge: 'Market Context',
            title: 'Neighbourhood Sales Map',
            details: ['Recent Sales', 'Active Listings'],
            image: 'valuation-map.jpg',
            alt: 'A locked preview of neighbourhood sales context.'
          },
          {
            badge: 'Next Step',
            title: 'Prep or Hold Strategy',
            details: ['Timing', 'Improvements'],
            image: 'valuation-plan.jpg',
            alt: 'A locked preview of a valuation strategy.'
          }
        ]
      },
      colors: {
        primary: '#315c72',
        secondary: '#1d2b34',
        accent: '#c9823f',
        text: '#17202a',
        background: '#f8faf9'
      },
      trustBadges: ['Local Valuation Review', 'No Obligation', 'Current Market Comparables'],
      dynamicInject: {
        h1: 'What Is Your {{term}} Home Worth Right Now?',
        subheadline: 'A thoughtful local value estimate for {{term}} homeowners.'
      }
    }
  },

  utmRules: {
    priority: ['utm_campaign', 'utm_source', 'utm_medium'],
    fallbackBehavior: 'default',
    neighborhoodInjection: true,
    persistDuration: 30
  }
};
