const fs = require('fs');

const extract = () => {
  const content = {};

  // 1. Child Quiz
  const quizData = fs.readFileSync('src/data/quizData.js', 'utf8');
  const quizMatch = quizData.match(/export const QUIZ_QUESTIONS = (\[[\s\S]*?\])/);
  if (quizMatch) {
    const questions = eval(quizMatch[1]);
    questions.forEach(q => {
      content[`qcontent_${q.id}_q`] = q.q;
      q.options.forEach((o, i) => {
        content[`qcontent_${q.id}_o${i}`] = o;
      });
    });
  }

  // 2. Parent Activities
  const parentData = fs.readFileSync('src/data/parentActivitiesData.js', 'utf8');
  ['A', 'B', 'C', 'D'].forEach(mod => {
    const modMatch = parentData.match(new RegExp(`export const MODULE_${mod} = ([\s\S]*?\])`));
    if (modMatch) {
      const items = eval(modMatch[1]);
      items.forEach(item => {
        content[`acontent_${mod.toLowerCase()}_${item.id}_title`] = item.title;
        content[`acontent_${mod.toLowerCase()}_${item.id}_desc`] = item.description;
        if (item.format) content[`acontent_${mod.toLowerCase()}_${item.id}_format`] = item.format;
      });
    }
  });

  // Tiers
  const tiersMatch = parentData.match(/export const PARENT_TIERS = (\[[\s\S]*?\])/);
  if (tiersMatch) {
    const tiers = eval(tiersMatch[1]);
    tiers.forEach(t => {
      content[`acontent_tier_${t.tier}_label`] = t.label;
      content[`acontent_tier_${t.tier}_req`] = t.requirement;
    });
  }

  // Parent Quizzes
  const spellingMatch = parentData.match(/export const SPELLING_BEE_QUESTIONS = (\[[\s\S]*?\])/);
  if (spellingMatch) {
    eval(spellingMatch[1]).forEach((q, i) => {
      content[`apquiz_spelling_${i}_q`] = q.q;
      q.options.forEach((o, j) => content[`apquiz_spelling_${i}_o${j}`] = o);
    });
  }
  const gkMatch = parentData.match(/export const GENERAL_KNOWLEDGE_QUESTIONS = (\[[\s\S]*?\])/);
  if (gkMatch) {
    eval(gkMatch[1]).forEach((q, i) => {
      content[`apquiz_gk_${i}_q`] = q.q;
      q.options.forEach((o, j) => content[`apquiz_gk_${i}_o${j}`] = o);
    });
  }
  const mathsMatch = parentData.match(/export const MATHS_MENTAL_QUESTIONS = (\[[\s\S]*?\])/);
  if (mathsMatch) {
    eval(mathsMatch[1]).forEach((q, i) => {
      content[`apquiz_maths_${i}_q`] = q.q;
      q.options.forEach((o, j) => content[`apquiz_maths_${i}_o${j}`] = o);
    });
  }

  // Article
  const articleMatch = parentData.match(/export const READING_TIP_ARTICLE = (\{[\s\S]*?\n\})/);
  if (articleMatch) {
    const article = eval('(' + articleMatch[1] + ')');
    content['article_reading_title'] = article.title;
    article.body.forEach((p, i) => content[`article_reading_p${i+1}`] = p);
    article.questions.forEach((q, i) => {
      content[`article_reading_q${i+1}_q`] = q.q;
      q.options.forEach((o, j) => content[`article_reading_q${i+1}_o${j}`] = o);
    });
  }

  // 3. Trail
  const trailData = fs.readFileSync('src/data/trailData.js', 'utf8');
  const stopsMatch = trailData.match(/export const STOPS = (\[[\s\S]*?\])/);
  if (stopsMatch) {
    eval(stopsMatch[1]).forEach(s => {
      content[`tcontent_s${s.number}_name`] = s.name;
      content[`tcontent_s${s.number}_fact`] = s.fact;
      content[`tcontent_s${s.number}_location`] = s.location;
      content[`tcontent_s${s.number}_q`] = s.quiz.question;
      s.quiz.options.forEach((o, i) => content[`tcontent_s${s.number}_o${i}`] = o);
    });
  }

  // 4. Local Facts
  const localData = fs.readFileSync('src/data/localFactsData.js', 'utf8');
  const factsMatch = localData.match(/export const LOCAL_FACTS = (\[[\s\S]*?\])/);
  if (factsMatch) {
    eval(factsMatch[1]).forEach((f, i) => {
      const n = i + 1;
      content[`lcontent_f${n}_title`] = f.title;
      content[`lcontent_f${n}_text`] = f.factText;
      content[`lcontent_f${n}_location`] = f.locationName;
      content[`lcontent_f${n}_q`] = f.quizQuestion;
      content[`lcontent_f${n}_oA`] = f.optionA;
      content[`lcontent_f${n}_oB`] = f.optionB;
      content[`lcontent_f${n}_oC`] = f.optionC;
      content[`lcontent_f${n}_oD`] = f.optionD;
    });
  }

  // 5. Daily Challenges
  const dailyData = fs.readFileSync('src/data/dailyChallenges.js', 'utf8');
  const dailyMatch = dailyData.match(/export const DAILY_CHALLENGES = (\[[\s\S]*?\])/);
  if (dailyMatch) {
    eval(dailyMatch[1]).forEach(d => {
      content[`dcontent_${d.id}_q`] = d.question;
      d.options.forEach((o, i) => content[`dcontent_${d.id}_o${i}`] = o);
      content[`dcontent_${d.id}_fact`] = d.funFact;
    });
  }

  fs.writeFileSync('english_content_keys.json', JSON.stringify(content, null, 2));
};

extract();
