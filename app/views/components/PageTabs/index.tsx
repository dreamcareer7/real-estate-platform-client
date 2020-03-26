import React, { useState, ReactNode } from 'react'
import { Tabs, createStyles, makeStyles, Theme } from '@material-ui/core'

export * from './Tab'
export * from './TabLink'
export * from './DropdownTab'
export * from './TabSpacer'

type SelectedTab = string | number | boolean | null
type RenderMegaMenu = {
  selectedTab: SelectedTab
  close: () => void
}
interface Props {
  tabs: ReactNode[]
  actions?: ReactNode[]
  defaultValue?: SelectedTab
  defaultAction?: SelectedTab
  value?: SelectedTab
  actionValue?: SelectedTab
  megamenuTabs?: SelectedTab[]
  megaMenu?: (p: RenderMegaMenu) => ReactNode
  onChange?: (value: SelectedTab) => void
  onChangeAction?: (value: SelectedTab) => void
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      position: 'relative',
      display: 'flex',
      width: '100%'
    },
    tabContainer: {
      width: '100%',
      margin: theme.spacing(1, 0),
      borderBottom: `1px solid ${theme.palette.divider}`
    },
    indicator: {
      display: 'flex',
      justifyContent: 'center',
      backgroundColor: 'transparent',
      '& > div': {
        maxWidth: 30,
        width: '100%',
        borderRadius: theme.spacing(
          theme.shape.borderRadius,
          theme.shape.borderRadius,
          0,
          0
        ),
        backgroundColor: theme.palette.primary.main
      }
    },
    megaMenuContainer: {
      padding: theme.spacing(2.5, 1.5),
      position: 'absolute',
      top: 57,
      left: 0,
      width: '100%',
      minHeight: 250,
      zIndex: theme.zIndex.gridAction,
      background: theme.palette.background.paper,
      boxShadow: '0px 10px 15px rgba(0, 0, 0, 0.1)'
    }
  })
)

/**
 *  @example
 * <PageTabs
    tabs={[
      <Tab key={0} label="All" value={0} />,
      <TabLink key={1} label="Drafts" value={1} to="link" />,
      <Tab
        key={2}
        value={2}
        label={
          <DropdownTab title="Menu">
            {({ toggleMenu }) => (
              <>
                <MenuItem key={0} onClick={toggleMenu}>
                  Menu 1
                </MenuItem>
                <MenuItem key={1} onClick={toggleMenu}>
                  Menu 2
                </MenuItem>
                <MenuItem key={2} onClick={toggleMenu}>
                  Menu 3
                </MenuItem>
              </>
            )}
          </DropdownTab>
        }
      />
    ]}
  />
 */
export function PageTabs({
  defaultValue = null,
  defaultAction = null,
  value,
  actions,
  actionValue,
  tabs,
  megamenuTabs = [],
  megaMenu,
  onChange = () => {},
  onChangeAction = () => {}
}: Props) {
  const classes = useStyles()
  const [selectedTab, setSelectedTab] = useState<SelectedTab>(defaultValue)
  const [selectedAction, setSelectedAction] = useState<SelectedTab>(
    defaultAction
  )
  const [showMegaMenu, setShowMegaMenu] = useState<boolean>(false)

  const activeTab =
    defaultValue && selectedTab !== defaultValue ? defaultValue : selectedTab

  const activeAction =
    defaultAction && selectedAction !== defaultAction
      ? defaultAction
      : selectedAction

  const handleChangeTab = (e: React.MouseEvent<{}>, tab: SelectedTab) => {
    if (megaMenu && megamenuTabs) {
      if (megamenuTabs.includes(tab)) {
        const isVisible = !(tab === selectedTab && showMegaMenu)

        setShowMegaMenu(isVisible)
      } else {
        setShowMegaMenu(false)
      }
    }

    setSelectedTab(tab)

    onChange(tab)
  }

  const handleChangeAction = (e: React.MouseEvent<{}>, action: SelectedTab) => {
    setSelectedAction(action)

    onChangeAction(action)
  }
  const closeMegaMenu = () => setShowMegaMenu(false)

  return (
    <div className={classes.container}>
      <Tabs
        value={value || activeTab || false}
        indicatorColor="primary"
        textColor="primary"
        variant="scrollable"
        scrollButtons="auto"
        onChange={handleChangeTab}
        classes={{
          root: classes.tabContainer,
          indicator: classes.indicator
        }}
        TabIndicatorProps={{ children: <div /> }}
      >
        {tabs.map(tab => tab)}
      </Tabs>

      {actions && (
        <div>
          <Tabs
            value={actionValue || activeAction || false}
            onChange={handleChangeAction}
            variant="scrollable"
            scrollButtons="auto"
            classes={{
              root: classes.tabContainer,
              indicator: classes.indicator
            }}
            TabIndicatorProps={{ children: <div /> }}
          >
            {actions.map(tab => tab)}
          </Tabs>
        </div>
      )}

      {megaMenu && showMegaMenu && (
        <div className={classes.megaMenuContainer}>
          {megaMenu({ selectedTab, close: closeMegaMenu })}
        </div>
      )}
    </div>
  )
}
