<script lang="ts" setup>
import { computed, onMounted, onUnmounted, onUpdated, ref } from 'vue'
import MarkdownIt from 'markdown-it'
import mdKatex from '@traptitech/markdown-it-katex'
import mila from 'markdown-it-link-attributes'
import hljs from 'highlight.js'
import { copyToClip } from '@/utils/copy'
import 'highlight.js/styles/github.css';

interface Props {
  inversion?: boolean
  error?: boolean
  text?: string
  loading?: boolean
  asRawText?: boolean
}

const props = defineProps<Props>()

const textRef = ref<HTMLElement>()

const mdi = new MarkdownIt({
  html: false,
  linkify: true,
  highlight(code, language) {
    const validLang = !!(language && hljs.getLanguage(language))
    if (validLang) {
      const lang = language ?? ''
      return highlightBlock(hljs.highlight(code, { language: lang }).value, lang)
    }
    return highlightBlock(hljs.highlightAuto(code).value, '')
  }
})

mdi.use(mila, { attrs: { target: '_blank', rel: 'noopener' } })
mdi.use(mdKatex, { blockClass: 'katexmath-block rounded-md p-[10px]', errorColor: ' #cc0000' })


const text = computed(() => {
  const value = props.text ?? ''
  if (!props.asRawText)
    return mdi.render(value)
  return value
})

function highlightBlock(str: string, lang?: string) {
  return `<pre class="code-block-wrapper"><div class="code-block-header"><span class="code-block-header__lang">${lang}</span><span class="code-block-header__copy">copy</span></div><code class="hljs code-block-body ${lang}">${str}</code></pre>`
}

function addCopyEvents() {
  if (textRef.value) {
    const copyBtn = textRef.value.querySelectorAll('.code-block-header__copy')
    copyBtn.forEach((btn) => {
      btn.addEventListener('click', () => {
        const code = btn.parentElement?.nextElementSibling?.textContent
        if (code) {
          copyToClip(code).then(() => {
            btn.textContent = 'copy success'
            setTimeout(() => {
              btn.textContent = 'copy'
            }, 1000)
          })
        }
      })
    })
  }
}

function removeCopyEvents() {
  if (textRef.value) {
    const copyBtn = textRef.value.querySelectorAll('.code-block-header__copy')
    copyBtn.forEach((btn) => {
      btn.removeEventListener('click', () => {})
    })
  }
}

onMounted(() => {
  addCopyEvents()
})

onUpdated(() => {
  addCopyEvents()
})

onUnmounted(() => {
  removeCopyEvents()
})
</script>

<template>
  <div ref="textRef">
    <div v-if="!inversion">
      <div
        v-if="!asRawText"
        class="markdown-body"
        v-html="text"
      />
      <div
        v-else
        class="whitespace-pre-wrap"
        v-text="text"
      />
    </div>
    <div
      v-else
      class="whitespace-pre-wrap"
      v-text="text"
    />
    <template v-if="loading">
      <span>thinking...</span>
    </template>
  </div>
</template>

<style lang="scss">
.markdown-body {
	background-color: transparent;
	font-size: 14px;

	p {
		white-space: pre-wrap;
	}

  p:not(:last-child), pre {
    margin-bottom: 10px;
  }

	ol {
    list-style-type: decimal;
    // margin-left: 20px;
  }

  li {
    margin-left: 20px;
    line-height: 1.65;
  }

	ul {
		list-style-type: disc;
	}

	pre code,
	pre tt {
		line-height: 1.65;
	}

	.highlight pre,
	pre {
		background-color: #fff;
	}

	code.hljs {
		padding: 5px;
	}

	.code-block {
		&-wrapper {
			position: relative;
      border-radius: 5px;
		}

		&-header {
			position: absolute;
			top: 5px;
			right: 0;
			width: 100%;
			padding: 0 1rem;
			display: flex;
			justify-content: flex-end;
			align-items: center;
			color: #b3b3b3;
      border-radius: 10px;

			&__copy {
				cursor: pointer;
				margin-left: 0.5rem;
				user-select: none;
        border-radius: 10px;
        padding: 0px 8px;
        text-align: center;

				&:hover {
					// color: #65a665;
          background-color: #c4c4c493;
				}
			}
		}

    &-body {
      border-radius: 5px;
      border: 1px solid #e4e7ed;
    }
	}

}
</style>
