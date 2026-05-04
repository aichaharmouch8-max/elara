import { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const T = {
  en: {
    /* fonts */
    headingFont: "'Playfair Display', serif",
    serifFont:   "'Cormorant Garamond', serif",
    sansFont:    'Raleway, sans-serif',
    /* hero */
    heroEyebrow: 'Maison de Parfum',
    heroLine1:   'Wear the',
    heroLine2:   'Unspeakable',
    heroSub:     'For the woman who enters a room before she does.',
    shopNow:     'Shop Now',
    /* collection */
    collectionEyebrow:  'Eau de Parfum',
    collectionPre:      'The ',
    collectionHighlight:'Collection',
    /* products */
    productTaglines: {
      reine: 'Power. Seduction. Obsession. Saffron, Bulgarian rose and amber — crafted for the woman who leaves a mark.',
      oro:   'A fragrance that whispers what words cannot. Golden woods, luminous amber — your most intimate secret.',
      nova:  'Darkness never looked this divine. For the woman the night was made for.',
    },
    eauDeParfum:      'Eau de Parfum · 100ml',
    launchingSoon:    'Launching Soon',
    notifyMe:         'Notify Me',
    buyNow:           'Buy Now',
    orderPersonalized:'Order — Personalized',
    selectEdition:    'Select Edition',
    edition100ml:     '100ML · $49',
    editionSub100ml:  'Eau de Parfum',
    editionSignature: 'SIGNATURE',
    editionSigSub:    'Name in Gold · $69',
    exclusiveBadge:   '✦ EXCL',
    engravePlaceholder:'Your name to engrave…',
    engraveNote:      'Each bottle is hand-personalized before dispatch.',
    limitedSlots:     '✦ Limited personalized slots available each week',
    onTheList:        "You're on the list.",
    inTouch:          "We'll be in touch.",
    /* why elara */
    whyEyebrow: 'Why Elara',
    whyItems: [
      { title: 'Niche Formula',          body: 'Not a clone. Not inspired by anyone. A completely original scent crafted from scratch with premium raw ingredients.' },
      { title: '8–14 Hours On Skin',     body: '20% fragrance oil concentration. Designed to last through your longest, most important moments.' },
      { title: 'Premium Ingredients',    body: 'Bulgarian rose. Oud. Saffron. Sandalwood. Only the finest raw materials make it into every bottle.' },
      { title: 'Made to Be Remembered',  body: 'A scent that stays — on your skin, in the room, in the memory of everyone who was there.' },
    ],
    /* exclusive access */
    exclusiveEyebrow: 'Exclusive Access',
    exclusiveHead1:   'Be The First ',
    exclusiveHead2:   'To Know',
    exclusiveSub:     'Early access to new fragrances, private events and exclusive offers.',
    joinWaitlist:     'Join the Waitlist',
    /* nav */
    navHome:    'Home',
    navShop:    'Shop',
    navContact: 'Contact',
    navCart:    'Cart',
  },
  ar: {
    /* fonts */
    headingFont: "'Noto Naskh Arabic', serif",
    serifFont:   "'Noto Naskh Arabic', serif",
    sansFont:    "'Noto Naskh Arabic', serif",
    /* hero */
    heroEyebrow: 'بيت العطور',
    heroLine1:   '',
    heroLine2:   'ارتدِ ما لا يُقال',
    heroSub:     'للمرأة التي تدخل الغرفة قبل أن تصل',
    shopNow:     'تسوّقي الآن',
    /* collection */
    collectionEyebrow:  'ماء دو بارفان',
    collectionPre:      '',
    collectionHighlight:'المجموعة',
    /* products */
    productTaglines: {
      reine: 'القوة. الإغراء. الهوس. الزعفران، الورد البلغاري والعنبر — صُنعت للمرأة التي تترك أثراً.',
      oro:   'عطر يهمس بما لا تستطيع الكلمات قوله. أخشاب ذهبية، عنبر مضيء — سرّك الأكثر حميمية.',
      nova:  'لم يبدُ الظلام بهذا الجمال من قبل. للمرأة التي صُنع الليل من أجلها.',
    },
    eauDeParfum:      'ماء دو بارفان · ١٠٠ مل',
    launchingSoon:    'قريباً',
    notifyMe:         'أخبرني',
    buyNow:           'اشتري الآن',
    orderPersonalized:'طلب مخصص',
    selectEdition:    'اختاري الإصدار',
    edition100ml:     '١٠٠ مل · $٤٩',
    editionSub100ml:  'ماء دو بارفان',
    editionSignature: 'توقيع',
    editionSigSub:    'اسمكِ بالذهب · $٦٩',
    exclusiveBadge:   '✦ حصري',
    engravePlaceholder:'اسمكِ للنقش…',
    engraveNote:      'كل زجاجة تُشخصَن يدوياً قبل الشحن.',
    limitedSlots:     '✦ عدد محدود من الطلبات المخصصة أسبوعياً',
    onTheList:        'أنتِ على القائمة.',
    inTouch:          'سنتواصل معكِ قريباً.',
    /* why elara */
    whyEyebrow: 'لماذا إيلارا',
    whyItems: [
      { title: 'تركيبة فريدة',            body: 'ليست نسخة. ليست مستوحاة من أحد. عطر أصيل تماماً صُنع من الصفر بمكونات خام فاخرة.' },
      { title: '٨-١٤ ساعة على البشرة',    body: 'تركيز ٢٠٪ من زيوت العطر. مصمم ليدوم طوال أهم لحظاتك.' },
      { title: 'مكونات فاخرة',            body: 'ورد بلغاري. عود. زعفران. صندل. فقط أفخر المواد الخام في كل زجاجة.' },
      { title: 'صُنعت لتُحفر في الذاكرة', body: 'عطر يبقى — على بشرتك، في الغرفة، في ذاكرة كل من كان هناك.' },
    ],
    /* exclusive access */
    exclusiveEyebrow: 'وصول حصري',
    exclusiveHead1:   'كوني الأولى ',
    exclusiveHead2:   'لتعلمي',
    exclusiveSub:     'وصول مبكر إلى العطور الجديدة، الفعاليات الخاصة والعروض الحصرية.',
    joinWaitlist:     'انضمي إلى القائمة',
    /* nav */
    navHome:    'الرئيسية',
    navShop:    'المتجر',
    navContact: 'تواصلي معنا',
    navCart:    'السلة',
  },
};

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(() => localStorage.getItem('elara-lang') || 'en');
  const [fading, setFading] = useState(false);

  useEffect(() => {
    document.documentElement.dir  = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  const toggle = () => {
    setFading(true);
    setTimeout(() => {
      setLang(l => {
        const next = l === 'en' ? 'ar' : 'en';
        localStorage.setItem('elara-lang', next);
        return next;
      });
      setFading(false);
    }, 200);
  };

  return (
    <LanguageContext.Provider value={{ lang, toggle, t: T[lang], fading }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
