---
title: '마크다운 (Markdown) 문법 알아보기'
date: '2020-06-04'
category: 'blog'
description: ''
emoji: '📋'
---

[[info | ]]
| 자주 사용되는 마크다운(Markdown) 문법에 대해 정리한 포스트입니다.

# 마크다운이란?

`Github`, `Notion`를 사용해보면 자주 보았을 법한 `Markdown`은 텍스트 기반의 마크업 언어입니다.

마크다운은 간단한 특수 기호나 문자로(Markdown) 웹에서 빠르게 정적인 페이지(HTML)를 작성할 수 있습니다.

주된 사용 용도는 `Github`에서 `Repository`에 관한 설명, 기록을 적을 때나, `Notion` 등에서 `문서 작업`을 할 때 주로 이용됩니다.

현재, 저의 포스팅도 마크다운으로 작성되고 있습니다-! 😎

## 마크다운 사용법

### 1. 제목 (Heading)

HTML의 `<h1> ~ <h6>`와 태그와 동일합니다.

```
# Heading
### Heading
##### Heading
```

# Heading

### Heading

##### Heading

### 2. 인용문 (Blockquotes)

```
> This is a first blockqute.
>> This is a second blockqute.
>>> This is a third blockqute.
```

> This is a first blockqute.
>
> > This is a second blockqute.
> >
> > > This is a third blockqute.

### 3. 리스트 (List)

#### 순서 없는 리스트

`*`, `-`, `+` 모두 사용이 가능하다 !

```
* Backend
  - Java
  + NodeJS
  * Python
```

- Backend
  - Java
  - NodeJS
  - Python

#### 순서 있는 리스트

```
1. 알고리즘 풀기
2. 블로그 글 작성
3. 휴식 시간
```

1. 알고리즘 풀기
2. 블로그 글 작성
3. 휴식 시간

### 4. 코드 블럭 (Code blocks)

1. 한 단어만 감싸는 경우

   ```
   `<p>`, `Markdown`
   ```

   `<p>`, `Markdown`

2. 전체 문장을 삽입하는 경우

   - 코드의 시작과 끝에 \`\`\` 를 붙여서 사용합니다. (백틱)

   ```
   This is a code blocks !
   ```

추가로, 첫번째 \`\`\` 뒤에 원하는 언어를 명시하면 특정 언어 문법에 대한 색상이 적용됩니다.

**Ex) JavaScipt 코드 블럭**

```javascript
const value = 'Hello World!';
```

### 5. 강조 (Emphasis)

각각 `<em>`, `<strong>`, `<del>` 태그로 변환됩니다.

```
*Hello World*
**Hello World**
~~Hello World~~
```

_Hello World_  
**Hello World**  
~~Hello World~~

밑줄은 `<u></u>` 태그를 사용하세요.  
<u>문자 밑줄 긋기</u>

### 6. 수평선 (Horizontal Line)

문단과 문단 사이를 나눌 때 사용되는 수평선은 HTML의 `<hr />`과 동일합니다.

```
* * *
***
*****
- - -
-----
```

---

---

---

---

---

### 7. 링크 (Links)

HTML의 `<a>` 링크를 걸 수 있습니다.

```
[GOOGLE](https://google.com)

[NAVER](https://naver.com "링크 설명(title)을 작성하세요.")

[상대적 참조](../blog/category)

[GitHub][var]

문서 안에서 [참조 링크]를 그대로 사용할 수도 있습니다.

또는, 일반 URL이나 꺾쇠 괄호(`< >`)안의 URL은 자동으로 링크를 생성합니다.
구글 홈페이지: https://google.com
네이버 홈페이지: <https://naver.com>

[var]: https://github.com
```

[GOOGLE](https://google.com)

[NAVER](https://naver.com '링크의 설명란')

[상대적 참조](../blog/category)

[GitHub][var]

일반 URL이나 꺾쇠 괄호(`< >`)안의 URL은 자동으로 링크를 생성합니다.  
GOOLE : https://google.com  
NAVER : <https://naver.com>

[var]: https://github.com

### 8. 이미지 (Images)

HTML의 `<img>` 태그와 동일하게 작동합니다.

```
![Rocket](./images/rocket.png)
```

![Rocket](./images/rocket.png)

## 추천 해줄 마크다운 툴

`Mac`과 `Window` 또는 `웹 플랫폼`에서도 사용이 가능한 `Notion`을 사용해보시는 것을 추천드립니다.

`Notion` 에서는 마크다운의 명령어를 직접 작성할 필요 없이 `/`입력을 통해 여러 태그를 쉽게 적용이 가능합니다.
또한, 작성한 Notion 문서를 마크다운 파일로 `export`하거나 `import`도 가능합니다.

기존 Notion 2.7버전 이전은 `1000 블럭`까지만 무료로 사용이 가능했으나  
5월 19일부터 노션 2.8과 함께 개인 사용자에게 노션의 핵심 기능들을 무료로 제공한다고 공지했으니 마음껏 사용해보시는 것을 추천드립니다.

Reference : [노션 무료화 공지에 대해](https://www.44bits.io/ko/post/news--notion-announced-personal-plan-for-free)

#### 추가 팁) Gatsby를 사용하시는 분들에게 추천

Gatsby Plugin - 1 : [gatsby-remark-embed-youtube](https://www.gatsbyjs.org/packages/gatsby-remark-embed-youtube/?=video)  
Gatsby Plugin - 2 : [gatsby-remark-embed-video](https://www.gatsbyjs.org/packages/gatsby-remark-embed-video/?=video)

위의 개츠비 플러그인을 사용하면 유튜브 또는 일반 영상도 마크다운에서 영상 업로드가 가능하니 참고하세요 !

```
아래와 같은 형식으로 작성하면 됩니다 ! (유튜브 링크 주소대로 넣으면 거부됩니다)
`youtube:https://www.youtube.com/embed/영상코드`
```

제가 최근 가장 즐겨 듣는 음악인 `Harry Styles - Watermelon Sugar` 올리면서 이번 포스팅을 마무리하겠습니다.  
봐주셔서 감사합니다 🙇🏻‍♂️

`youtube:https://www.youtube.com/embed/7-x3uD5z1bQ`

## 참고 문서

[ihoneymon의 마크다운 작성법](https://gist.github.com/ihoneymon/652be052a0727ad59601)  
[hyeyoonjung의 마크다운 작성법](http://blog.hyeyoonjung.com/2017/05/30/how-to-use-markdown/)
