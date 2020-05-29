import { Editor } from 'grapesjs'
import grapesjsPluginCkeditor from 'grapesjs-plugin-ckeditor'
import {
  FontManager,
  FONT_FAMILY_DEFAULT,
  OPTIONS_DEFAULTS
} from '@samuelmeuli/font-manager'

import config from 'config'

import grapesConfig from './config'

async function loadFontFamilies(families: string[]): Promise<void> {
  if (families.length === 0) {
    return
  }

  await new FontManager(config.google.api_key, FONT_FAMILY_DEFAULT, {
    ...OPTIONS_DEFAULTS,
    families
  }).init()
}

const STYLE_MANAGER_TEXT_TAGS = [
  'div',
  'section',
  'table',
  'tr',
  'td',
  'ol',
  'ul',
  'li',
  'p',
  'span',
  'a',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'address',
  'q',
  'label',
  'mj-text',
  'mj-button'
]

const STYLE_MANAGER_ALIGNABLE_TAGS = ['mj-social']

const STYLE_MANAGER_BG_COLORABLE_TAGS = [
  'mj-button',
  'mj-column',
  'mj-section',
  'mj-wrapper'
]

const STYLE_MANAGER_WIDTH_ALLOWED_TAGS = ['mj-button']

const STYLE_MANAGER_PADDING_ALLOWED_TAGS = ['mj-section', 'mj-wrapper']

const CK_EDITOR_BUTTONS_TO_REMOVE = [
  'Anchor',
  'Cut',
  'Copy',
  'Paste',
  'PasteText',
  'PasteFromWord',
  'Undo',
  'Redo'
]

const CK_EDITOR_LINE_HEIGHT_VALUES = [
  '1',
  '1.1',
  '1.2',
  '1.4',
  '1.5',
  '1.7',
  '2',
  '2.5',
  '3'
]

export async function createGrapesInstance(
  Grapesjs: any,
  { assets, colors, fontFamilies, plugins, pluginsOpts }
): Promise<Editor> {
  await loadFontFamilies(fontFamilies)

  return Grapesjs.init({
    ...grapesConfig,
    keepUnusedStyles: true,
    container: '#grapesjs-canvas',
    components: null,
    assetManager: {
      assets
    },
    storageManager: {
      autoload: 0,
      params: {
        templateId: null
      }
    },
    showDevices: false,
    plugins: [
      'asset-blocks',
      'style-manager',
      grapesjsPluginCkeditor,
      ...plugins
    ],
    pluginsOpts: {
      ...pluginsOpts,
      [grapesjsPluginCkeditor]: {
        options: {
          toolbarGroups: [
            {
              name: 'paragraph',
              groups: ['list', 'indent', 'align']
            },
            { name: 'links' },
            '/',
            { name: 'basicstyles', groups: ['basicstyles', 'colors'] },
            { name: 'styles' },
            { name: 'others' }
          ],
          removeButtons: CK_EDITOR_BUTTONS_TO_REMOVE.join(','),
          colorButton_colors: colors
            .map(color => color.replace('#', ''))
            .join(','),
          line_height: CK_EDITOR_LINE_HEIGHT_VALUES.join(';'),
          font_names: fontFamilies.join(';'),
          colorButton_enableMore: false,
          linkShowAdvancedTab: false,
          linkShowTargetTab: false
        }
      },
      'style-manager': {
        fontSizePicker: {
          conditions: {
            allowedTags: STYLE_MANAGER_TEXT_TAGS,
            forbiddenStyles: ['background-image']
          }
        },
        fontWeightPicker: {
          conditions: {
            allowedTags: STYLE_MANAGER_TEXT_TAGS,
            forbiddenStyles: ['background-image']
          },
          disabled: true
        },
        textAlignPicker: {
          conditions: {
            allowedTags: [
              ...STYLE_MANAGER_TEXT_TAGS,
              ...STYLE_MANAGER_ALIGNABLE_TAGS
            ],
            forbiddenStyles: ['background-image']
          }
        },
        colorPicker: {
          conditions: {
            allowedTags: STYLE_MANAGER_TEXT_TAGS,
            forbiddenStyles: ['background-image']
          }
        },
        backgroundColorPicker: {
          conditions: {
            allowedTags: STYLE_MANAGER_BG_COLORABLE_TAGS,
            forbiddenStyles: ['background-image']
          }
        },
        widthPicker: {
          conditions: {
            allowedTags: STYLE_MANAGER_WIDTH_ALLOWED_TAGS,
            forbiddenStyles: []
          }
        },
        paddingPicker: {
          conditions: {
            allowedTags: STYLE_MANAGER_PADDING_ALLOWED_TAGS,
            forbiddenStyles: []
          }
        }
      }
    }
  })
}
