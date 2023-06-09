import { useCallback, useMemo, useRef, useState } from 'react'

import {
  Box,
  Button,
  CircularProgress,
  makeStyles,
  Typography
} from '@material-ui/core'
import type { Model } from 'backbone'
import cn from 'classnames'
import { omit } from 'lodash'
import LZString from 'lz-string'
import { LabelModel } from 'pikaso'

import { noop } from '@app/utils/helpers'
import OverlayDrawer from '@app/views/components/OverlayDrawer'
import { PageTabs, Tab } from '@app/views/components/PageTabs'

import type { TemplateOptions } from '../../../types'

import { AdvancedProperties } from './AdvancedProperties'
import { BasicProperties } from './BasicProperties'
import { Context } from './context'
import { FontExplorer } from './FontExplorer'
import { useEditor } from './hooks/use-editor'
import { TextEditor } from './TextEditor'

const useStyles = makeStyles(
  () => ({
    header: {
      userSelect: 'none'
    },
    drawerBodyRoot: {
      display: 'flex',
      flexDirection: 'column',
      maxHeight: '100vh',
      overflow: 'auto'
    },
    tab: {
      display: 'none',
      '&.active': {
        display: 'block'
      }
    }
  }),
  {
    name: 'MarketingCenterBlocksCanvasTextDrawer'
  }
)

type Tabs = 'fonts' | 'basic-properties' | 'advanced-properties'

interface Props {
  model: Nullable<Model>
  templateUrl: string
  templateOptions: Nullable<TemplateOptions>
  onClose: () => void
}

export function CanvasTextDrawer({
  model,
  templateOptions,
  templateUrl,
  onClose
}: Props) {
  const classes = useStyles()
  const initialState = model?.get('canvas-json')
  const [activeTab, setActiveTab] = useState<Tabs>('fonts')

  const editorRef = useRef<Nullable<HTMLDivElement>>(null)
  const { editor, reset, getLabelNode } = useEditor({
    editorRef,
    state: initialState
  })

  const textPreviewLabel = useMemo(
    () => getLabelNode(editor),
    [editor, getLabelNode]
  )

  const handleCancel = async () => {
    const editor = await reset()

    handleSave(getLabelNode(editor))
  }

  const handleSave = async (label: Nullable<LabelModel>) => {
    if (!label) {
      onClose()

      return
    }

    const ignoredFields = ['width', 'height', 'x', 'y']
    const { text } = label.textNode.attrs

    const data = {
      label: omit(label.textNode.attrs, ignoredFields),
      tag: omit(label.tagNode.attrs, ignoredFields),
      root: {
        rotation: label?.node.getAttr('rotation') ?? 0
      },
      url: `${templateUrl}/blocks.json`
    }

    const encoded = LZString.compressToEncodedURIComponent(JSON.stringify(data))
    const rect = label.node.getClientRect()

    model?.trigger('canvas-text:save-state', {
      text,
      rect,
      json: data,
      data: encoded
    })

    model?.trigger('canvas-text:update', {
      image: `https://fancy.rechat.com/text.png?q=${encoded}`,
      width: rect.width,
      height: rect.height
    })

    onClose()
  }

  const preview = useCallback(() => {
    if (!textPreviewLabel) {
      return
    }

    const image = textPreviewLabel.node.toDataURL({
      pixelRatio: 2
    })

    const rect = textPreviewLabel.node.getClientRect()

    model!.trigger('canvas-text:update', {
      image,
      width: rect.width,
      height: rect.height
    })
  }, [textPreviewLabel, model])

  const setTextProperty = useCallback(
    (property: string, value: unknown) => {
      textPreviewLabel?.textNode.setAttr(property, value)
    },
    [textPreviewLabel]
  )

  const setTagProperty = useCallback(
    (property: string, value: unknown) => {
      textPreviewLabel?.tagNode.setAttr(property, value)
    },
    [textPreviewLabel]
  )

  const getTextProperty = useCallback(
    (property: string) => {
      return textPreviewLabel?.textNode.getAttr(property)
    },
    [textPreviewLabel]
  )

  const getTagProperty = useCallback(
    (property: string) => {
      return textPreviewLabel?.tagNode.getAttr(property)
    },
    [textPreviewLabel]
  )

  return (
    <>
      <OverlayDrawer open hideBackdrop width={460} onClose={noop}>
        <OverlayDrawer.Header title="Fancy Test">
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            py={1}
            className={classes.header}
          >
            <Typography variant="h6">Fancy Font</Typography>

            <Box display="flex" alignItems="center">
              {initialState && (
                <Box mr={1}>
                  <Button color="secondary" onClick={handleCancel}>
                    Cancel
                  </Button>
                </Box>
              )}
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleSave(textPreviewLabel)}
              >
                Done
              </Button>
            </Box>
          </Box>
        </OverlayDrawer.Header>
        <OverlayDrawer.Body className={classes.drawerBodyRoot}>
          {editor ? (
            <div>
              <Context.Provider
                value={{
                  editor,
                  textPreviewLabel,
                  templateOptions,
                  setTextProperty,
                  setTagProperty,
                  getTextProperty,
                  getTagProperty,
                  preview
                }}
              >
                <div>
                  <TextEditor />
                </div>

                <div>
                  <PageTabs
                    defaultValue={activeTab}
                    value={activeTab}
                    tabs={[
                      <Tab key={0} label="Font" value="fonts" />,
                      <Tab
                        key={1}
                        label="Properties"
                        value="basic-properties"
                      />,
                      <Tab
                        key={2}
                        label="Advanced"
                        value="advanced-properties"
                      />
                    ]}
                    onChange={tab => setActiveTab(tab as Tabs)}
                  />

                  <Box
                    className={cn(classes.tab, {
                      active: activeTab === 'fonts'
                    })}
                  >
                    <FontExplorer />
                  </Box>

                  <Box
                    className={cn(classes.tab, {
                      active: activeTab === 'basic-properties'
                    })}
                  >
                    <BasicProperties />
                  </Box>

                  <Box
                    className={cn(classes.tab, {
                      active: activeTab === 'advanced-properties'
                    })}
                  >
                    <AdvancedProperties />
                  </Box>
                </div>
              </Context.Provider>
            </div>
          ) : (
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              height="100%"
            >
              <CircularProgress />
            </Box>
          )}
        </OverlayDrawer.Body>
      </OverlayDrawer>

      <div
        id="editor"
        ref={editorRef}
        style={{
          visibility: 'hidden',
          position: 'absolute',
          left: -9999,
          top: -9999
        }}
      />
    </>
  )
}
