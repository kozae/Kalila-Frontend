export interface IMorphology {
  Id: string;
  Word: string;
  Rasm: string;
  Unvocalized: string;
  Prefix: string;
  Stem: string;
  Type: string;
  Diac: string;
  Canonic: string;
  Lemma: string;
  PatLemma: string;
  Root: string;
  PartOfSpeech: string;
  Suffix: string;
}

export const MorphologyTypes = new Map<
  string,
  { name: string; description: string }
>([
  [
    'فعل ماض مبني للمعلوم',
    { name: 'V-Pa-A', description: 'Past verb in active' },
  ],
  [
    'فعل ماض مبني للمجهول',
    { name: 'V-Pa-P', description: 'Past verb in passive' },
  ],
  [
    'فعل مضارع مؤكد مبني للمجهول',
    {
      name: 'V-Pr-P-E',
      description: 'Present verb in passive, in energetic mood',
    },
  ],
  ['فعل ناسخ', { name: 'V-M', description: 'Modal verb' }],
  [
    'فعل أمر جامد',
    { name: 'V-I-F', description: 'Fossilized imperative verb' },
  ],
  ['فعل أمر', { name: 'V-I', description: 'Imperative verb' }],
  ['فعل', { name: 'V', description: 'Verb' }],
  ['فعل ماض جامد', { name: 'V-Pa-F', description: 'Fossilized past verb' }],
  [
    'فعل مضارع مبني للمجهول',
    { name: 'V-Pr-P', description: 'Present verb in passive' },
  ],
  [
    'فعل مضارع مؤكد مبني للمعلوم',
    { name: 'V-Pr-A-E', description: 'Present verb in energetic mood' },
  ],
  ['فعل مضارع مبني للمعلوم', { name: 'V-Pr-A', description: 'Present verb' }],
  [
    'فعل مضارع جامد',
    { name: 'V-Pr-F', description: 'Fossilized present verb' },
  ],

  ['حرف نصب', { name: 'P-A', description: 'Accusative particle' }],
  ['حرف احتمال', { name: 'P-P', description: 'Possibility particle' }],
  ['حرف نفي', { name: 'P-N', description: 'Negative particle' }],
  ['حرف مصدري', { name: 'P-I', description: 'Infinitive particle' }],
  ['حرف عطف', { name: 'P-C', description: 'Coordination particle' }],
  ['حرف توقع', { name: 'P-E', description: 'Expectation particle' }],
  ['حرف ناسخ', { name: 'P-M', description: 'Modal particle' }],
  ['حرف جر', { name: 'P-P', description: 'Preposition' }],
  ['حرف ابتداء', { name: 'P-In', description: 'Initial particle' }],
  ['حرف تفصيل', { name: 'P-Cm', description: 'Comparative particle' }],
  ['حرف تعليل', { name: 'P-J', description: 'Justification particle' }],
  ['حرف جواب', { name: 'P-R', description: 'Replay particle' }],
  ['حرف استفهام', { name: 'P-Int', description: 'Interrogative particle' }],
  ['حرف مركب', { name: 'P-Co', description: 'Composite particle' }],
  ['حرف تفسير', { name: 'P-Ex', description: 'Explanation particle' }],
  ['حرف توكيد', { name: 'P-Con', description: 'Confirmation particle' }],
  ['حرف استفتاح', { name: 'P-O', description: 'Opening particle' }],
  ['حرف امتناع', { name: 'P-Cou', description: 'Counterfactual particle' }],

  ['ظرف زمان', { name: 'Av-T', description: 'Temporal adverb' }],
  ['ظرف مكان', { name: 'Av-L', description: 'Local adverb' }],
  ['ظرف', { name: 'Av', description: 'Adverb' }],

  ['اسم تفضيل', { name: 'N-C', description: 'Comparative noun' }],
  ['من الأسماء الستة', { name: 'N-6', description: 'One of the six nouns' }],
  ['اسم الجلالة', { name: 'N-G', description: 'Noun for God' }],
  ['اسم يفيد الكل', { name: 'N-C', description: 'Collective noun' }],
  ['مصدر أصلي', { name: 'N-I', description: 'Proper infinitive' }],
  ['مصدر ميمي', { name: 'N-I-M', description: 'Meem infinitive' }],
  ['اسم إشارة', { name: 'N-D', description: 'Deictic noun' }],
  ['اسم صوت', { name: 'N-S', description: 'Noun denoting a sound' }],
  ['اسم زمان أو مكان', { name: 'N-Pt', description: 'Noun for place or time' }],
  ['اسم', { name: 'N', description: 'Noun' }],
  [
    'مبالغة اسم الفاعل',
    { name: 'N-PE', description: 'Participle noun in exaggeration form' },
  ],
  ['اسم استثناء', { name: 'N-E', description: 'Exclusion noun' }],
  ['اسم فاعل', { name: 'N-P', description: 'Participle noun' }],
  ['مصدر هيئة', { name: 'N-I-F', description: 'Form infinitive' }],
  ['اسم علم', { name: 'N-E', description: 'Entity noun' }],
  ['اسم مركب', { name: 'N-Co', description: 'Composite noun' }],
  ['اسم مفعول', { name: 'N-PP', description: 'Past participle noun' }],
  ['اسم جامد', { name: 'N-F', description: 'Fossilized noun' }],
  ['اسم منصوب', { name: 'N-Acc', description: 'Accusative noun' }],
  ['اسم شرط', { name: 'N-Con', description: 'Conditional noun' }],
  ['مصدر مرة', { name: 'N-Is', description: 'Single occurrence infinitive' }],
  ['اسم فعل أمر', { name: 'N-Imp', description: 'Imperative noun' }],

  ['صفة مشبهة', { name: 'Aj-T', description: 'Trait adjective' }],

  ['ضمير المخاطب', { name: 'PN-2', description: 'Second person pronoun' }],
  ['اسم موصول', { name: 'N-Co', description: 'Coordination pronoun' }],

  ['حرف استثناء', { name: 'P-Ex', description: 'Exclusion particle' }],

  ['حرف جزم', { name: '', description: '' }],
  ['جار ومجرور', { name: '', description: '' }],
  ['اسم فعل ماض', { name: '', description: '' }],
  ['ضمير المتكلم', { name: '', description: '' }],
  ['حرف جزاء', { name: '', description: '' }],
  ['اسم آلة', { name: '', description: '' }],
  ['حرف تنبيه', { name: '', description: '' }],
  ['فعل أمر مؤكد', { name: '', description: '' }],
  ['نسبة', { name: '', description: '' }],
  ['مصدر صناعي', { name: '', description: '' }],
  ['نسبة إلى اسم علم', { name: '', description: '' }],
  ['حرف شرط', { name: '', description: '' }],
  ['حرف تسويف للمضارع', { name: '', description: '' }],
  ['حرف زائد', { name: '', description: '' }],
  ['حرف نهي', { name: '', description: '' }],
  ['حرف نداء', { name: '', description: '' }],
  ['اسم استفهام', { name: '', description: '' }],
  ['اسم فعل مضارع', { name: '', description: '' }],
  ['ضمير الغائب', { name: '', description: '' }],
]);
