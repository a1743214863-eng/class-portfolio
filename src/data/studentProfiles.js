import { CLASSMATES } from './classmates'

const BIO_TEMPLATES = [
  '热爱建筑与物件设计，关注空间体验与材料表达。',
  '擅长手绘与模型制作，喜欢在课程之外探索 DIY 创作。',
  '对城市公共空间与小型构筑物有持续兴趣。',
  '致力于将构造逻辑与美学表达结合在设计实践中。',
]

export const studentProfiles = Object.fromEntries(
  CLASSMATES.map((name, index) => [
    name,
    {
      name,
      bio: BIO_TEMPLATES[index % BIO_TEMPLATES.length],
    },
  ]),
)

export function getStudentProfile(name) {
  return studentProfiles[name] || { name, bio: '这位同学还没有填写个人简介。' }
}
