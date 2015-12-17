// RoomsList.js
import React, { Component } from 'react'
import S from 'shorti'
import Loading from '../../../Partials/Loading'
import ProfileImage from './ProfileImage'
import helpers from '../../../../utils/helpers'
import _ from 'lodash'

export default class RoomsList extends Component {

  handleClick(i){
    const rooms = this.props.data.rooms
    const room = rooms[i]
    this.props.getMessages(room)
  }

  render(){
    
    // Data
    const data = this.props.data
    let rooms = data.rooms
    const current_room = data.current_room

    if(rooms && !rooms.length){
      return <div style={ S('ml-20 mt-20') }>No rooms yet.</div>
    }

    let rooms_list = <Loading />

    if(data.is_filtering)
      rooms = data.filtered_rooms

    if(rooms){

      rooms_list = rooms.map((room, i) => {

        // Profile image
        let profile_image_url
        let profile_image_div
        if(room.latest_message.author){
          profile_image_url = room.latest_message.author.profile_image_url
          profile_image_div = (
            <ProfileImage data={ data } profile_image_url={ profile_image_url }/>
          )
        }
        if(!room.latest_message.author)
          profile_image_div = (
            <div style={ S('absolute') }>
              <img src="/images/dashboard/rebot.png" style={ S('w-30') } />
            </div>
          )

        let list_style = { ...S('pointer pt-10 pb-10 pl-10 pr-37'), borderBottom: '1px solid #e7e4e3' }
        if(current_room && current_room.id == room.id){
          list_style = { ...list_style, ...S('bg-f0f0f0') }
        }

        // List users
        const users = room.users
        const first_names = _.pluck(users, 'first_name')
        let first_name_list = ''
        first_names.forEach((first_name, i) => {
          first_name_list += first_name
          if(i<first_names.length - 1) first_name_list += ', '
        })
        
        // Time posted
        const latest_created = room.latest_message.created_at.toString().split('.')
        const time_created = helpers.timeConverter(latest_created[0])
        let comment
        if(room.latest_message.comment){
          comment = (
            <div style={ S('color-808080') }>{ room.latest_message.comment.substring(0, 50) }{ room.latest_message.comment.length > 50 ? '...': '' }</div>
          )
        }
        return (
          <li style={ list_style } key={ room.id } onClick={ this.handleClick.bind(this, i) }>
            <div style={ S('relative') }>
              { profile_image_div }
              <div className="pull-left" style={ S('ml-50 w-90p') }>
                <div className="pull-left" style={ S('w-60p') }>
                  <b>{ room.title.substring(0, 50) }{ room.title.length > 50 ? '...': '' }</b>
                </div>
                <div className="pull-right text-right" style={ S('color-ccc w-40p') } >
                  { time_created.month } { time_created.date }, { time_created.time_friendly }
                </div>
                <div className="clearfix"></div>
                <div style={ S('color-aaaaaa') }>{ first_name_list }</div>
                { comment }
              </div>
              <div className="clearfix"></div>
            </div>
          </li>
        )
      })
    } // if rooms

    // Styles
    const rooms_scroll_area = {
      ...S('mt-5'),
      overflow: 'scroll',
      height: window.innerHeight - 123
    }

    return (
      <div>
        <div style={ rooms_scroll_area }>
          <ul style={ S('pl-0') }>{ rooms_list }</ul>
        </div>
      </div>
    )
  }
}

// PropTypes
RoomsList.propTypes = {
  data: React.PropTypes.object.isRequired
}