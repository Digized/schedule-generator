import React from 'react';
import SearchInput, {createFilter} from 'react-search-input'
import Courses from './Schedules/schedules_winter_2018_part.json'

const KEYS_TO_FILTERS = ['course_code', 'course_title']


export default class SearchCourses extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      searchTerm: ''
    }
    this.searchUpdated = this.searchUpdated.bind(this)
  }

  render () {
    const filteredEmails = Courses.courses.filter(createFilter(this.state.searchTerm, KEYS_TO_FILTERS))

    return (
      <div>
        <SearchInput className='search-input' onChange={this.searchUpdated} />
        {filteredEmails.map((Courses, index) => {
          return (
            <div key={index}>
              <div>{Courses.course_code} | {Courses.course_title}</div>
            </div>
          )
        })}
      </div>
    )
  }

  searchUpdated (term) {
    this.setState({searchTerm: term})
  }
}

