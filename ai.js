// ===================================
// المساعد الذكي (AI Assistant)
// ===================================
const AIAssistant = {
    panel: null,
    messages: [],
    
    init() {
        this.panel = document.getElementById('ai-assistant-panel');
        this.setupEventListeners();
    },
    
    setupEventListeners() {
        document.getElementById('ai-assistant-btn')?.addEventListener('click', () => this.togglePanel());
        document.getElementById('close-ai-panel')?.addEventListener('click', () => this.togglePanel());
        
        document.getElementById('send-ai-message')?.addEventListener('click', () => this.sendMessage());
        
        document.getElementById('ai-input')?.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });
        
        // الاقتراحات السريعة
        document.querySelectorAll('.suggestion-chips .chip').forEach(chip => {
            chip.addEventListener('click', () => {
                const suggestion = chip.dataset.suggestion;
                this.handleSuggestion(suggestion);
            });
        });
    },
    
    togglePanel() {
        this.panel?.classList.toggle('hidden');
    },
    
    sendMessage() {
        const input = document.getElementById('ai-input');
        const message = input.value.trim();
        
        if (!message) return;
        
        // إضافة رسالة المستخدم
        this.addMessage(message, 'user');
        input.value = '';
        
        // محاكاة رد الذكاء الاصطناعي
        setTimeout(() => {
            const response = this.generateResponse(message);
            this.addMessage(response, 'assistant');
        }, 1000);
    },
    
    addMessage(content, type) {
        const container = document.getElementById('ai-messages');
        if (!container) return;
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `ai-message ${type}`;
        messageDiv.textContent = content;
        container.appendChild(messageDiv);
        
        // التمرير للأسفل
        container.scrollTop = container.scrollHeight;
        
        this.messages.push({ content, type, timestamp: new Date() });
    },
    
    generateResponse(message) {
        // ردود مبنية على الكلمات المفتاحية (محاكاة محسنة)
        const lowerMessage = message.toLowerCase();
        
        if (lowerMessage.includes('شخصية') || lowerMessage.includes('character')) {
            return this.generateCharacterSuggestion();
        } else if (lowerMessage.includes('حبكة') || lowerMessage.includes('plot')) {
            return this.generatePlotSuggestion();
        } else if (lowerMessage.includes('عالم') || lowerMessage.includes('world')) {
            return this.generateWorldBuildingSuggestion();
        } else if (lowerMessage.includes('وصف') || lowerMessage.includes('describe')) {
            return this.generateDescriptionSuggestion();
        } else if (lowerMessage.includes('حوار') || lowerMessage.includes('dialogue')) {
            return this.generateDialogueSuggestion();
        } else if (lowerMessage.includes('تحليل') || lowerMessage.includes('analyze')) {
            return this.generateAnalysisSuggestion();
        } else if (lowerMessage.includes('تحسين') || lowerMessage.includes('improve')) {
            return this.generateImprovementSuggestion();
        } else {
            return this.generateGeneralResponse();
        }
    },
    
    generateCharacterSuggestion() {
        const names = ['أحمد', 'فاطمة', 'محمد', 'زينب', 'خالد', 'مريم', 'عمر', 'عائشة'];
        const traits = ['شجاع', 'ذكي', 'غامض', 'طموح', 'وفي', 'مغامر'];
        const backgrounds = ['يتيم نشأ في الشوارع', 'نبيل فقد ثروته', 'تاجر سفر كثيراً', 'عالم اكتشف سراً قديماً'];
        
        const name = names[Math.floor(Math.random() * names.length)];
        const trait = traits[Math.floor(Math.random() * traits.length)];
        const background = backgrounds[Math.floor(Math.random() * backgrounds.length)];
        
        return `إليك اقتراح لشخصية:\n\nالاسم: ${name}\nالصفة الرئيسية: ${trait}\nالخلفية: ${background}\n\nيمكنك تطوير هذه الشخصية بإضافة:\n- دوافع وأهداف محددة\n- مخاوف وضعفات\n- علاقات مع شخصيات أخرى\n- قوس تطوري خلال القصة`;
    },
    
    generatePlotSuggestion() {
        const hooks = [
            'اكتشاف رسالة قديمة تغير مجرى الأحداث',
            'لقاء غير متوقع بشخص من الماضي',
            'اختفاء غامض لشخصية رئيسية',
            'اكتشاف قوة خارقة غير متوقعة',
            'خيانة من شخص مقرب'
        ];
        
        const hook = hooks[Math.floor(Math.random() * hooks.length)];
        
        return `فكرة حبكة مقترحة:\n\n${hook}\n\nلتطوير هذه الحبكة:\n1. ابدأ بمقدمة تمهد للاكتشاف\n2. ابنِ التصاعد الدرامي تدريجياً\n3. ضع عقبات وتحديات أمام الشخصية\n4. اصل إلى الذروة في اللحظة المناسبة\n5. قدّم حلاً مُرضياً للقارئ`;
    },
    
    generateWorldBuildingSuggestion() {
        return `أفكار لبناء العالم:\n\n🏰 نظام الحكم:\n- مملكة وراثية\n- جمهورية تجارية\n- اتحاد قبائل\n\n💰 النظام الاقتصادي:\n- عملة قائمة على المعادن الثمينة\n- نظام المقايضة\n- عملات ورقية مدعومة\n\n📜 القوانين والعادات:\n- قوانين صارمة لحماية السحر\n- تقاليد الزواج بين العائلات\n- طقوس الانتقال إلى الرشد\n\n🗺️ الجغرافيا:\n- سلاسل جبلية تفصل المناطق\n- أنهار رئيسية للتجارة\n- صحاري قاحلة في الجنوب`;
    },
    
    generateDescriptionSuggestion() {
        return `نصائح للوصف الإبداعي:\n\n1. استخدم الحواس الخمس:\n   - ماذا يرى البطل؟\n   - ماذا يسمع؟\n   - ماذا يشم؟\n   - ماذا يلمس؟\n   - ماذا يتذوق؟\n\n2. تجنب السرد المباشر:\n   ❌ "كان الجو بارداً"\n   ✅ "تصاعدت أنفاسه البيضاء في الهواء، وارتعشت أصابعه حول المقود"\n\n3. اربط الوصف بالحالة العاطفية:\n   - المكان الكئيب يعكس الحزن\n   - المكان المشرق يعكس الأمل`;
    },
    
    generateDialogueSuggestion() {
        return `نصائح للحوار الجيد:\n\n1. اجعل كل شخصية لها صوت مميز:\n   - مفردات خاصة\n   - طريقة نطق مميزة\n   - جمل قصيرة/طويلة حسب الشخصية\n\n2. استخدم الأفعال بدلاً من الإكثار من "قال":\n   - همس، صرخ، تمتم، قاطع\n\n3. أضف لغة الجسد:\n   "أدار وجهه بعيداً" بدلاً من "قال بغضب"\n\n4. اجعل الحوار يخدم القصة:\n   - يكشف معلومات\n   - يطور الشخصيات\n   - يخلق توتراً`;
    },

    // --- إضافة: اقتراح تحليل النص ---
    generateAnalysisSuggestion() {
        return `تحليل النص الذي تكتبه:\n\n- ابحث عن النقاط القوية في أسلوبك.\n- حدد العناصر التي تحتاج إلى تطوير (مثل الحوار، الوصف، السرعة).\n- حاول قراءة النص بصوت عالٍ لاكتشاف أي جمل غير طبيعية.\n- اسأل نفسك: هل هذا المشهد يخدم القصة؟ هل الشخصيات متسقة؟\n\nيمكنني مساعدتك في تحليل مقطع معين إذا أرسلته لي.`;
    },

    // --- إضافة: اقتراح تحسين الأسلوب ---
    generateImprovementSuggestion() {
        return `نصائح لتحسين أسلوبك الكتابي:\n\n1. اقرأ كثيراً في مجال كتابتك.\n2. اكتب يومياً ولو بضع جمل.\n3. راجع نصوصك بعد يومين بنظر جديد.\n4. استخدم قاموساً للمرادفات لتجنب التكرار.\n5. اطلب آراء من قراء موثوقين.\n6. تدرب على كتابة أوصاف وجمل قصيرة معبرة.\n\nإذا أرسلت لي جزءاً من نصك، يمكنني تقديم اقتراحات محددة.`;
    },
    
    generateGeneralResponse() {
        return `أنا مساعدك الذكي للكتابة الإبداعية! 🖋️\n\nيمكنني مساعدتك في:\n\n✍️ تطوير الشخصيات\n📖 أفكار للحبكات والقصص\n🌍 بناء العوالم الخيالية\n📝 تحسين الأسلوب الكتابي\n💡 محفزات وإلهام للكتابة\n📊 تحليل النصوص\n\nاسألني عن أي شيء يتعلق بكتابتك!`;
    },
    
    handleSuggestion(type) {
        const suggestions = {
            'develop-character': 'ساعدني في تطوير شخصية جديدة',
            'plot-idea': 'أعطني فكرة حبكة مثيرة',
            'world-building': 'ساعدني في بناء عالم خيالي',
            'writing-prompt': 'أعطني محفزاً للكتابة',
            'improve-style': 'كيف يمكنني تحسين أسلوبي الكتابي؟'
        };
        
        const input = document.getElementById('ai-input');
        if (input && suggestions[type]) {
            input.value = suggestions[type];
            this.sendMessage();
        }
    }
};