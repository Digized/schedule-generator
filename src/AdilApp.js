import React from 'react';

export default class AdilApp extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            num:0
        }
    }
    render() {
        return (
            <div>
                {this.state.num}
                <button onClick={() => this.setState({num:(this.state.num+ 1)})}> HI</button>
            </div>
        )
    }
}