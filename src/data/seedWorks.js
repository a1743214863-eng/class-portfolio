import { COURSES, YEARS } from './curriculum'

const CATEGORY_CYCLE = [
  '建筑设计',
  '作品物件',
  '城市设计',
  '手绘草图',
  '构造技术',
  '课程作业',
  '建筑摄影',
]

const ADVISORS = ['王教授', '李老师', '张老师', '陈老师', '刘老师']

const STUDENTS = [
  { title: '空间设计方案', author: '闫诺' },
  { title: '产品设计习作', author: '刘醇煌' },
  { title: '建筑概念方案', author: '张致德' },
  { title: '器物设计作品', author: '阿依孜巴·阿力木' },
  { title: '课程设计作业', author: '马伊佳' },
  { title: '创意物品设计', author: '冉德惠' },
  { title: '建筑设计探索', author: '任海成' },
  { title: '模型制作作品', author: '王有财' },
  { title: '空间营造方案', author: '胡博雅' },
  { title: '生活用品设计', author: '邓洁' },
  { title: '建筑形态研究', author: '马湘源' },
  { title: '材料与构造习作', author: '曾翔鸿' },
  { title: '公共建筑设计', author: '夏乐乐' },
  { title: '设计物件作品', author: '崔宝玉' },
  { title: '建筑课程作业', author: '王梓名' },
  { title: '创意产品方案', author: '陈文灿' },
  { title: '综合设计作品', author: '符肖文' },
]

export const seedWorks = STUDENTS.map((item, index) => {
  const seed = index + 1
  const image = `https://picsum.photos/seed/${seed}/400/300`
  const largeImage = `https://picsum.photos/seed/${seed}/1200/800`
  const largeImage2 = `https://picsum.photos/seed/${seed + 100}/1200/800`
  const year = YEARS[index % YEARS.length]
  const semester = index % 2 === 0 ? '1' : '2'
  const course = COURSES[index % COURSES.length]
  const workType = index % 5 === 0 ? 'diy' : 'course'

  return {
    id: String(seed),
    title: item.title,
    author: item.author,
    category: CATEGORY_CYCLE[index % CATEGORY_CYCLE.length],
    advisor: ADVISORS[index % ADVISORS.length],
    images: [largeImage, largeImage2],
    image,
    description:
      '本作品探索空间、材料与功能的综合表达，通过模型与图纸呈现设计思路与建造逻辑。欢迎同学在详情中补充完整设计说明。',
    year,
    semester,
    course,
    workType,
    likes: (index * 3) % 18,
    created_at: `${year}-0${(index % 6) + 3}-01`,
  }
})
