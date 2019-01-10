import React, { Fragment } from 'react'
import { connect } from 'react-redux'

import { updateTask } from 'actions/deals'

import Spinner from 'components/Spinner'
import IconButton from 'components/Button/IconButton'
import CloseIcon from 'components/SvgIcons/Close/CloseIcon'
import EditIcon from 'components/SvgIcons/Edit/EditIcon'

import TaskStatus from '../../Checklists/TaskRow/Status'

import { Input, Toolbar, TitleContainer, Title } from './styled'

class Header extends React.Component {
  state = {
    showEditName: false,
    isSavingName: false
  }

  toggleEditName = () =>
    this.setState(state => ({
      showEditName: !state.showEditName
    }))

  handleSaveName = async () => {
    // todo
    const newValue = this.nameInput.value.trim()

    if (newValue.length === 0 && newValue === this.props.task.title) {
      return false
    }

    this.setState({
      showEditName: false,
      isSavingName: true
    })

    await this.props.updateTask(this.props.task.id, {
      title: newValue
    })

    this.setState({
      isSavingName: false
    })
  }

  onInputKeyPress = e => {
    if (e.which === 13) {
      this.handleSaveName()
    }
  }

  render() {
    if (!this.props.task) {
      return false
    }

    return (
      <Fragment>
        <Toolbar>
          <div>
            <TaskStatus
              task={this.props.task}
              isDraftDeal={this.props.deal.is_draft}
            />
          </div>

          <div>
            {this.state.isSavingName === false && (
              <IconButton
                isFit
                iconSize="large"
                inverse
                onClick={this.toggleEditName}
              >
                <EditIcon />
              </IconButton>
            )}

            <IconButton
              isFit
              iconSize="large"
              inverse
              style={{
                marginLeft: '1.5rem'
              }}
              onClick={this.props.onClose}
            >
              <CloseIcon />
            </IconButton>
          </div>
        </Toolbar>

        <TitleContainer>
          {this.state.showEditName && (
            <Input
              autoFocus
              ref={ref => (this.nameInput = ref)}
              defaultValue={this.props.task.title}
              onBlur={this.handleSaveName}
              onKeyPress={this.onInputKeyPress}
            />
          )}

          {this.state.showEditName === false && !this.state.isSavingName && (
            <Title onDoubleClick={this.toggleEditName}>
              {this.props.task.title}
            </Title>
          )}

          {this.state.isSavingName && <Spinner />}
        </TitleContainer>
      </Fragment>
    )
  }
}

export default connect(
  null,
  {
    updateTask
  }
)(Header)
