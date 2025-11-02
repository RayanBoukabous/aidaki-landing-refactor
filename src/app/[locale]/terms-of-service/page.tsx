"use client";

import { useParams } from "next/navigation";
import { getDirection } from "../../../i18n";
import VisualsTopbar from "../../components/visuals/VisualsTopbar";
import Footer from "../../components/Footer";

export default function TermsOfServicePage() {
  const params = useParams();
  const currentLocale = params.locale as string;
  const direction = getDirection(currentLocale);
  const isRTL = direction === "rtl";

  // Contenu en arabe
  const contentAr = {
    title: "الشروط العامة لاستخدام تطبيق التعليم",
    sections: [
      {
        id: "parties",
        title: "بين الموقعين:",
        content: `شركة AI UNIVERS، شركة ذات مسؤولية محدودة برأس مال قدره 1.000.000 دينار، يقع مقرها الاجتماعي في إقامة الأوركيد، الكثبان الرملية، طريق شيراقا، مبنى "C"، شيراقا 16016 الجزائر، مسجلة في المركز الوطني للسجل التجاري بالجزائر تحت الرقم 24B1282498 (يشار إليها فيما يلي بـ "الناشر")، و

أي شخص يقوم بالوصول إلى التطبيق و/أو استخدام الخدمات (يشار إليه فيما يلي بـ "المستخدم"). يُطلق على "الناشر" و"المستخدم" كل واحد منهما على حدة "طرف" ويشار إليهما معًا بـ "الأطراف".`
      },
      {
        id: "object",
        title: "1. الهدف",
        content: `تهدف الشروط العامة للاستخدام (يشار إليها فيما يلي بـ "CGU") إلى تحديد شروط الوصول والاستخدام لتطبيق AIDAKI والموقع المرتبط www.aidaki.ai (يشار إليهما فيما يلي بـ "التطبيق")، الذي يقدم المحتويات والخدمات التعليمية الرقمية (يشار إليها فيما بعد بـ "الخدمات").`
      },
      {
        id: "acceptance",
        title: "2. القبول والمستندات التعاقدية",
        content: `يتضمن الوصول إلى التطبيق واستخدامه قبولًا كاملًا وغير مشروط لـ CGU. في حالة التضارب، يتم الاحتكام للأولوية بالتسلسل التنازلي: (i) الشروط الخاصة (الاشتراك، العرض الخاص)، (ii) الشروط العامة للاستخدام الحالية، (iii) سياسة حماية البيانات الشخصية و (iv) سياسة الكوكيز. يُقر المستخدم قانونيًا بالقدرة على التعاقد أو استخدام التطبيق تحت إشراف وموافقة ممثله القانوني إذا لزم الأمر.`
      },
      {
        id: "description",
        title: "3. وصف الخدمات",
        content: `يوفر التطبيق، على وجه الخصوص: الوصول إلى الدورات والمصادر التعليمية عبر الإنترنت، الفيديوهات، التمارين التفاعلية، التقييمات، المنتديات، وأدوات متابعة التقدم. قد تختلف الميزات حسب الخطة المختارة (مدفوعة، خيارات). يمكن للناشر تطوير الخدمات لأسباب مشروعة، دون إلحاق الضرر بجوهر الالتزامات المتعاقد عليها للخدمات المدفوعة الجاري تنفيذها.`
      },
      {
        id: "account",
        title: "4. إنشاء الحساب والوصول",
        content: `قد يتطلب إنشاء حساب للاستفادة من بعض الميزات. يلتزم المستخدم بتقديم معلومات دقيقة ومحدثة وكاملة والحفاظ عليها. إن معرّفات الدخول شخصية وسرية وغير قابلة للتحويل. المستخدم مسؤول عن أي نشاط يتم باستخدام معرفاته ويبلغ فورًا عن أي اشتباه في استخدام احتيالي.`
      },
      {
        id: "license",
        title: "5. ترخيص الاستخدام والملكية الفكرية",
        content: `رهناً بالامتثال لـ CGU، والوفاء بأي دفوعات مستحقة، يمنح الناشر للمستخدم ترخيصًا شخصيًا غير حصري وغير قابل للتحويل وقابل للإلغاء للوصول والاستخدام للتطبيق والمحتويات التعليمية، للاستخدام الشخصي غير التجاري والخاص فقط، في إطار الخدمات، وللمدة الممنوحة. التطبيق والدورات والفيديوهات والنصوص والصور والرسومات والشعارات والواجهات وقواعد البيانات، وجميع العلامات والعناصر المحمية (يشار إليها فيما بعد بـ "المحتويات") هي ملكية حصرية للناشر أو المانحين له. لا يُمنح للمستخدم أي حق في استنساخ أو تمثيل أو تكييف أو ترجمة أو استغلال أو استخراج كلي أو جزئي، باستثناء ما هو مسموح به صراحةً هنا.`
      },
      {
        id: "prohibition",
        title: "6. حظر الاستخدام على منصات أخرى والتوزيع",
        content: `يلتزم المستخدم صراحةً بعدم: أ) تنزيل أو استخراج أو نسخ أو التقاط أو تسجيل أو إعادة نشر أو بث، أو إتاحة أو تأجير أو قرض، أو بيع أو منح ترخيص، أو استغلال المحتويات بأي طريقة خارج التطبيق؛ ب) استخدام أو استيراد أو إعادة نشر أو دمج المحتويات، كلياً أو جزئياً، في أي تطبيق أو موقع إلكتروني أو منصة مشاركة أو شبكة اجتماعية أو خدمة سحابية أو أي دعم آخر (بما في ذلك الأنظمة الداخلية للشركة)، حتى لو كانت مجانًا؛ ج) القيام بأي استخراج جوهري لقاعدة البيانات أو أي أعمال سكراب؛ د) تجاوز التدابير التقنية للحماية أو التحكم أو منح الوصول أو الاستخدام.

أي استخدام غير مصرح به للمحتويات خارج التطبيق يعتبر خرقًا خطيرًا، قد يؤدي إلى تعليق أو إنهاء الحساب، دون الإخلال باتخاذ الإجراءات المدنية والجنائية والمطالبات بالتعويض.`
      },
      {
        id: "user-content",
        title: "7. محتويات المستخدم",
        content: `يحتفظ المستخدم بملكية الحقوق على المحتويات التي ينشرها أو ينقلها عبر التطبيق (واجبات، رسائل، مساهمات، تعليقات، إلخ). يضمن المستخدم أنه يمتلك الحقوق اللازمة ولا يجوز له نشر أو مشاركة أي محتوى غير قانوني أو انتهاكي أو تشهيري أو معادي للحقوق.`
      },
      {
        id: "usage",
        title: "8. الاستخدام المسموح والقيود",
        content: `يتعهد المستخدم باستخدام التطبيق بما يتوافق مع القوانين وCGU. ويحظر، على وجه الخصوص: الهندسة العكسية، تفكيك الشيفرة، اختبار الاختراق غير المعتمد، تجاوز جدر الدفع، إنشاء حسابات متعددة احتيالية، استخدام البوتات أو السكربتات التي تعطل الخدمات، إرسال الرسائل العشوائية، أو أي انتهاك للأمان أو النزاهة للتطبيق.`
      },
      {
        id: "financial",
        title: "9. البنود المالية",
        content: `قد تكون بعض الميزات مدفوعة الأجر. يتم تحديد الأسعار والخطط وشروط الدفع والفوترة المتكررة والتجارب المجانية وسياسات الاسترداد والتأخير والمشاكل المتعلقة بالدفع في وقت الاشتراك وفي شروط الدفع المتاحة عبر التطبيق. يجب سداد الفترات التي بدأت، ما لم ينص القانون على خلاف ذلك. في حالة عدم الدفع، قد يقوم الناشر بتعليق الوصول إلى الخدمات المدفوعة وبعد الإشعار، بإنهاء CGU.`
      },
      {
        id: "availability",
        title: "10. الوصول، التوافر، والصيانة",
        content: `يسعى الناشر بشكل معقول إلى ضمان الوصول والأمان للخدمات. قد تتسبب عمليات الصيانة المجدولة أو العاجلة في انقطاع الخدمات. يقر المستخدم بالتقلبات الكامنة في الشبكات والتقنيات ويوافق على أن التطبيق قد يكون غير متاح بشكل مؤقت.`
      },
      {
        id: "data-protection",
        title: "11. حماية البيانات الشخصية",
        content: `يتم معالجة البيانات الشخصية وفقاً لسياسة حماية البيانات الشخصية المتاحة على التطبيق، والتي تحدد الأغراض والأساسات القانونية وفترات الاحتفاظ والمستفيدين وحقوق الأفراد وطرق الممارسة. يلتزم المستخدم بعدم انتهاك حرمة حياة الآخرين ويحترم اللوائح المعمول بها.`
      },
      {
        id: "reporting",
        title: "12. الإبلاغ والاعتدال",
        content: `يمكن للمستخدم الإبلاغ عن أي محتوى أو سلوك غير قانوني أو غير لائق أو مخالف لـ CGU عبر contact@aidaki.ai يحتفظ الناشر بحق اعتدال أو تعليق أو حذف أي محتوى أو حساب مخالف لـ CGU أو القانون.`
      },
      {
        id: "warranties",
        title: "13. الضمانات والمسؤولية والقيود",
        content: `تُقدم الخدمات "كما هي". في الحدود التي يسمح بها القانون، يستثني الناشر أي ضمانات تناسبية لحاجة معينة وبتوفر غير منقطع. تقتصر مسؤولية الناشر، عن جميع الأضرار المتراكمة، بمبلغ إجمالي قدره الضرائب المدفوعة من قبل المستخدم في إطار الاشتراك الجاري. لا يتحمل الناشر مسؤولية الأضرار غير المباشرة أو فقدان البيانات أو الأرباح أو التشغيل أو الصورة.

لا يُستثنى من مسؤولية الغش أو الأخطاء الجسيمة، أو إصابة الحياة أو حقوق المستهلكين.`
      },
      {
        id: "third-party",
        title: "14. الروابط والخدمات المقدمة من الأطراف الثالثة",
        content: `قد يحتوي التطبيق على روابط أو يضم خدمات جهات خارجية (استضافة الفيديو، الدفع، الرسائل). لا يتحمل الناشر المسؤولية عن محتويات أو سياسات أو ممارسات هذه الجهات. تخضع استخدام هذه الخدمات لشروط وسياسات الجهات المعنية.`
      },
      {
        id: "force-majeure",
        title: "15. القوة القاهرة",
        content: `لا يتحمل أي طرف المسؤولية عن عدم الامتثال الناجم عن حدث قوة قاهرة كما هو معرف بالقانون والفقه. يتم تعليق تنفيذ الالتزامات المتأثرة أثناء مدة الحدث.`
      },
      {
        id: "duration",
        title: "16. المدة، التعليق والإلغاء",
        content: `تدخل CGU حيز التنفيذ عند قبول المستخدم وتظل سارية خلال استخدام التطبيق. في حالة خرق CGU أو الإضرار بالأمان أو الاحتيال أو وقوع حادث دفع، يمكن للناشر تعليق الوصول فوراً وبعد الإشعار، إنهاء CGU. يمكن للمستخدم إنهاء حسابه في أي وقت؛ لا تؤثر الإنهاء على المبالغ المستحقة ولا البنود المصممة للبقاء (الملكية الفكرية، المسؤولية، القانون المعمول به).`
      },
      {
        id: "transfer",
        title: "17. النقل",
        content: `لا يجوز للمستخدم تحويل كامل أو جزء من حقوقه والتزاماته دون موافقة خطية مسبقة من الناشر. يمكن للناشر نقل CGU في إطار إعادة الهيكلة، بشرط الحفاظ على الحقوق الأساسية للمستخدم.`
      },
      {
        id: "modifications",
        title: "18. تعديلات شروط CGU",
        content: `يمكن للناشر تعديل CGU لأسباب مشروعة، منها القانونية أو الفنية أو الاقتصادية. سيتم إعلام المستخدم بأي تعديل جوهري بإشعار مناسب. يؤدي استمرارية الاستخدام بعد سريان إلى قبول ذلك. في حالة الرفض، يجب على المستخدم التوقف عن استخدام التطبيق وإنهاء اشتراكه إذا لزم الأمر وفق الشروط المطبقة.`
      },
      {
        id: "notifications",
        title: "19. الإشعارات",
        content: `يتم إجراء الإشعارات صالحة عبر البريد الإلكتروني على العناوين المقدمة أو عبر التطبيق. يضمن المستخدم دقة وتحديث بيانات الاتصال الخاصة به.`
      },
      {
        id: "jurisdiction",
        title: "20. القانون المطبق والاختصاص القضائي",
        content: `تُخضع CGU بالقانون الجزائري. في حالة عدم التوصل لحل ودي، يتم إحالة أي نزاع يتعلق بصحة أو تنفيذ أو تفسير CGU إلى المحاكم المختصة بولاية الجزائر، مع مراعاة القواعد الحامية للمستهلكين.`
      },
      {
        id: "final",
        title: "21. الأحكام النهائية",
        content: `إذا قُضِي ببطلان أحد أحكام CGU، تبقى الأحكام الأخرى سارية. سيتم استبدال البند المعلن باطلًا ببند صالح يعكس النية الأولية للأطراف.`
      }
    ],
    footer: "تم في الجزائر، في 26 أكتوبر 2025"
  };

  // Contenu en français
  const contentFr = {
    title: "Conditions générales d'utilisation de l'application éducative",
    sections: [
      {
        id: "parties",
        title: "Entre les soussignés :",
        content: `La société AI UNIVERS, société à responsabilité limitée au capital de 1.000.000 Dinars, dont le siège social est situé à la Résidence L'Orchidée, les dunes, route de Chéraga, Bâtiment ''C'', Chéraga 16016 Alger, immatriculée au centre national du registre de commerce d'Alger sous le numéro 24B1282498 (ci-après dénommé, « l'Éditeur »),

Et

Toute personne accédant à l'application et/ou utilisant les services (ci-après dénommé, «l'Utilisateur»),

L'Éditeur et l'Utilisateur sont désignés individuellement comme une « Partie » et collectivement comme les « Parties ».`
      },
      {
        id: "object",
        title: "1. Objet",
        content: `Les présentes conditions générales d'utilisation (ci-après dénommé, les « CGU ») ont pour objet de définir les conditions d'accès et d'utilisation de l'application AIDAKI et du site associé www.aidaki.ai (ci-après dénommé, l'« Application »), proposant des contenus et services pédagogiques numériques (ci-après dénommé, les « Services »).`
      },
      {
        id: "acceptance",
        title: "2. Acceptation et documents contractuels",
        content: `L'accès et l'utilisation de l'Application impliquent l'acceptation pleine et entière des CGU. En cas de contradiction, prévalent dans l'ordre décroissant : (i) les conditions particulières (abonnement, offre spécifique), (ii) les présentes CGU, (iii) la Politique de protection des données personnelles et (iv) la Politique de cookies. L'Utilisateur déclare être capable juridiquement de contracter ou utiliser l'Application sous le contrôle et avec l'autorisation de son représentant légal le cas échéant.`
      },
      {
        id: "description",
        title: "3. Description des Services",
        content: `L'Application propose notamment : accès à des cours et ressources pédagogiques en ligne, vidéos, exercices interactifs, évaluations, forums, et outils de suivi de progression. Les fonctionnalités peuvent varier selon la formule choisie (payante, options). L'Éditeur peut faire évoluer les Services pour des motifs légitimes, sans altérer la substance des engagements souscrits pour les Services payants en cours d'exécution.`
      },
      {
        id: "account",
        title: "4. Création de compte et accès",
        content: `La création d'un compte peut être requise pour certaines fonctionnalités. L'Utilisateur s'engage à fournir des informations exactes, à jour et complètes, et à les maintenir à jour. Les identifiants sont personnels, confidentiels et non transférables. L'Utilisateur est responsable de toute activité effectuée avec ses identifiants et notifie sans délai toute suspicion d'usage frauduleux.`
      },
      {
        id: "license",
        title: "5. Licence d'utilisation et propriété intellectuelle",
        content: `Sous réserve du respect des CGU et, le cas échéant, du paiement des sommes dues, l'Éditeur concède à l'Utilisateur une licence personnelle, non exclusive, non transférable, non cessible et révocable d'accès et d'utilisation de l'Application et des contenus pédagogiques, pour un usage strictement personnel, non commercial et privé, dans le seul cadre des Services et pour la durée des droits acquis.

L'Application, les cours, vidéos, textes, images, graphiques, logos, interfaces, bases de données, ainsi que toutes marques et éléments protégés (ci-après dénommé, les « Contenus ») sont la propriété exclusive de l'Éditeur ou de ses concédants. 

Aucun droit de reproduction, représentation, adaptation, traduction, exploitation ou extraction, total ou partiel, hors les cas expressément autorisés aux présentes, n'est accordé à l'Utilisateur.`
      },
      {
        id: "prohibition",
        title: "6. Interdiction d'usage sur d'autres plateformes et de redistribution",
        content: `L'Utilisateur s'engage expressément à ne pas:

a) télécharger, extraire, copier, capturer, enregistrer, republier, diffuser, mettre à disposition, louer, prêter, vendre, concéder sous licence, ou autrement exploiter les Contenus en dehors de l'Application;

b) utiliser, importer, republier ou intégrer les Contenus, en tout ou partie, sur toute autre application, site web, plateforme de partage, réseau social, service cloud ou tout autre support (y compris systèmes internes d'entreprise), même à titre gratuit;

c) procéder à toute extraction substantielle de la base de données ou à des actes de scraping;

d) contourner les mesures techniques de protection, de streaming, d'accès ou de contrôle d'usage.

Toute utilisation non autorisée des Contenus en dehors de l'Application constitue un manquement grave, susceptible d'entraîner la suspension ou la résiliation du compte, sans préjudice de poursuites civiles et pénales et de demandes d'indemnisation.`
      },
      {
        id: "user-content",
        title: "7. Contenus de l'Utilisateur",
        content: `L'Utilisateur conserve la titularité des droits sur les contenus qu'il publie ou transmet via l'Application (devoirs, messages, contributions, commentaires, etc.). 

L'Utilisateur garantit disposer des droits nécessaires et s'interdit toute mise en ligne de contenus illicites, contrefaisants, diffamatoires, haineux ou attentatoires aux droits de tiers.`
      },
      {
        id: "usage",
        title: "8. Usage autorisé et restrictions",
        content: `L'Utilisateur s'engage à un usage conforme aux lois et aux CGU. Sont notamment interdits: l'ingénierie inverse, la décompilation, le test d'intrusion non autorisé, le contournement de paywalls, la création de comptes multiples frauduleux, l'utilisation de bots ou scripts perturbant les Services, l'envoi de spam, et toute atteinte à la sécurité ou à l'intégrité de l'Application.`
      },
      {
        id: "financial",
        title: "9. Modalités financières",
        content: `Certaines fonctionnalités peuvent être payantes. 

Les prix, plans, modalités de paiement, facturation récurrente, essais gratuits, politique de remboursement, retards et incidents de paiement, ainsi que toute évolution tarifaire, sont précisés au moment de la souscription et dans les modalités de paiement accessibles depuis l'Application. Les périodes entamées sont dues, sauf disposition légale impérative. En cas d'impayé, l'Éditeur peut suspendre l'accès aux Services payants et, après notification, résilier les CGU.`
      },
      {
        id: "availability",
        title: "10. Accès, disponibilité et maintenance",
        content: `L'Éditeur met en œuvre des moyens raisonnables pour assurer l'accessibilité et la sécurité des Services. Des opérations de maintenance planifiées ou urgentes peuvent entraîner des interruptions. L'Utilisateur reconnaît les aléas inhérents aux réseaux et technologies et accepte que l'Application puisse être ponctuellement indisponible.`
      },
      {
        id: "data-protection",
        title: "11. Protection des données personnelles",
        content: `Les données personnelles sont traitées conformément à la Politique de protection des données personnelles, disponible sur l'Application, précisant les finalités, bases légales, durées de conservation, destinataires, droits des personnes et modalités d'exercice. L'Utilisateur s'engage à ne pas porter atteinte à la vie privée d'autrui et à respecter la réglementation applicable.`
      },
      {
        id: "reporting",
        title: "12. Signalement et modération",
        content: `L'Utilisateur peut signaler tout contenu ou comportement illicite, inapproprié ou contraire aux CGU via contact@aidaki.ai 

L'Éditeur se réserve le droit de modérer, suspendre ou supprimer tout contenu ou compte contrevenant aux CGU ou à la loi.`
      },
      {
        id: "warranties",
        title: "13. Garanties, responsabilité et limites",
        content: `Les Services sont fournis « en l'état ». Dans la mesure permise par la loi, l'Éditeur exclut toute garantie d'adéquation à un besoin particulier et de disponibilité ininterrompue. La responsabilité de l'Éditeur est limitée, tous chefs de préjudices confondus, au montant total hors taxes payé par l'Utilisateur dans le cadre de l'abonnement en cours.

L'Éditeur n'est pas responsable des dommages indirects, pertes de données, de profits, d'exploitation ou d'image. Rien n'exclut la responsabilité en cas de dol, faute lourde, atteinte à la vie ou aux droits des consommateurs.`
      },
      {
        id: "third-party",
        title: "14. Liens et services tiers",
        content: `L'Application peut contenir des liens ou intégrer des services tiers (hébergement vidéo, paiement, messagerie). L'Éditeur n'est pas responsable des contenus, politiques ou pratiques de ces tiers. L'utilisation de ces services est régie par les conditions et politiques desdits tiers.`
      },
      {
        id: "force-majeure",
        title: "15. Force majeure",
        content: `Aucune Partie n'est responsable d'un manquement dû à un événement de force majeure tel que défini par la loi et la jurisprudence. L'exécution des obligations affectées est suspendue pendant la durée de l'événement.`
      },
      {
        id: "duration",
        title: "16. Durée, suspension et résiliation",
        content: `Les CGU entrent en vigueur à l'acceptation par l'Utilisateur et demeurent applicables pendant l'utilisation de l'Application. En cas de violation des CGU, atteinte à la sécurité, fraude, ou incident de paiement, l'Éditeur peut suspendre immédiatement l'accès et, après notification, résilier les CGU. L'Utilisateur peut résilier son compte à tout moment; la résiliation n'affecte pas les sommes dues ni les clauses destinées à survivre (propriété intellectuelle, responsabilité, droit applicable).`
      },
      {
        id: "transfer",
        title: "17. Cession",
        content: `L'Utilisateur ne peut céder tout ou partie de ses droits et obligations sans accord écrit préalable de l'Éditeur. L'Éditeur peut céder les CGU dans le cadre d'une opération de restructuration, sous réserve de préserver les droits essentiels de l'Utilisateur.`
      },
      {
        id: "modifications",
        title: "18. Modifications des CGU",
        content: `L'Éditeur peut modifier les CGU pour des motifs légitimes, notamment juridiques, techniques ou économiques. L'Utilisateur sera informé de toute modification substantielle avec un préavis raisonnable. La poursuite de l'utilisation après l'entrée en vigueur vaut acceptation. En cas de refus, l'Utilisateur doit cesser d'utiliser l'Application et, le cas échéant, résilier son abonnement selon les modalités applicables.`
      },
      {
        id: "notifications",
        title: "19. Notifications",
        content: `Les notifications sont valablement effectuées par courrier électronique aux adresses fournies ou via l'Application. L'Utilisateur garantit l'exactitude et la mise à jour de ses coordonnées.`
      },
      {
        id: "jurisdiction",
        title: "20. Droit applicable et juridiction compétente",
        content: `Les CGU sont régies par le droit algérien. En l'absence de solution amiable, tout litige relatif à la validité, l'exécution ou l'interprétation des CGU sera soumis aux tribunaux compétents de la wilaya d'Alger, sous réserve des règles impératives protectrices des consommateurs.`
      },
      {
        id: "final",
        title: "21. Dispositions finales",
        content: `Si une stipulation des CGU était déclarée nulle, les autres demeureraient en vigueur. La stipulation invalidée serait remplacée par une clause valide reflétant l'intention initiale des Parties.`
      }
    ],
    footer: ""
  };

  // Sélectionner le contenu selon la langue (français par défaut pour fr et en)
  const content = currentLocale === "ar" ? contentAr : contentFr;

  return (
    <div className="relative overflow-hidden min-h-screen">
      {/* Add VisualsTopbar */}
      <VisualsTopbar />

      {/* Hero Section */}
      <section className="relative py-16 md:py-24 bg-gradient-to-br from-green-700 via-green-600 to-green-800 border-b-2 border-green-400/50">
        {/* Background overlay */}
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(circle_at_15%_0%,rgba(255,255,255,0.45),transparent_35%),radial-gradient(circle_at_85%_120%,rgba(255,255,255,0.35),transparent_45%)]"></div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl relative z-10">
          <div className={`text-center ${isRTL ? 'text-right' : 'text-left'}`}>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight text-white drop-shadow-lg">
              {content.title}
            </h1>
            <div className="w-24 h-1 bg-white/50 mx-auto mt-6 rounded-full"></div>
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <section className="relative py-12 md:py-16 bg-green-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl relative z-10">
          <div className="space-y-8 md:space-y-12">
            {content.sections.map((section, index) => (
              <div
                key={section.id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-green-100 p-6 md:p-8"
              >
                <h2 className={`text-xl md:text-2xl font-bold text-green-900 mb-4 md:mb-6 ${isRTL ? 'text-right' : 'text-left'}`}>
                  {section.title}
                </h2>
                <div 
                  className={`text-gray-700 leading-relaxed whitespace-pre-line ${isRTL ? 'text-right' : 'text-left'} ${
                    isRTL ? 'font-arabic' : ''
                  }`}
                  style={{
                    fontFamily: isRTL ? '"Cairo", "Noto Sans Arabic", "Arial", sans-serif' : 'inherit',
                    lineHeight: isRTL ? '2' : '1.8'
                  }}
                >
                  {section.content}
                </div>
              </div>
            ))}
          </div>

          {/* Footer note */}
          {content.footer && (
            <div className={`mt-12 text-center text-gray-600 ${isRTL ? 'text-right font-arabic' : 'text-left'}`} style={{
              fontFamily: isRTL ? '"Cairo", "Noto Sans Arabic", "Arial", sans-serif' : 'inherit'
            }}>
              {content.footer}
            </div>
          )}
        </div>
      </section>

      {/* Add Footer */}
      <Footer />
    </div>
  );
}

