import moment from 'moment';
import classnames from 'classnames';
import { React, PropTypes, DateUtils } from 'nylas-exports';
import { MiniMonthView } from 'nylas-component-kit';

export default class DatePicker extends React.Component {
  static displayName = 'DatePicker';

  static propTypes = {
    value: PropTypes.number,
    onChange: PropTypes.func,
    dateFormat: PropTypes.string,
  };

  static contextTypes = {
    parentTabGroup: PropTypes.object,
  };

  static defaultProps = {
    dateFormat: null, // Default to valueOf
    onChange: () => {},
  };

  constructor(props) {
    super(props);
    this.state = { focused: false };
  }

  value() {
    return this.props.value ? moment(this.props.value) : null;
  }

  _onChange(newMoment) {
    if (this.props.dateFormat) {
      return this.props.onChange(newMoment.format(this.props.dateFormat));
    }
    return this.props.onChange(newMoment.valueOf());
  }

  _moveDay(numDays) {
    const val = this.value();
    const day = val.dayOfYear();
    this._onChange(val.dayOfYear(day + numDays));
  }

  _onKeyDown = event => {
    if (event.key === 'ArrowLeft') {
      this._moveDay(-1);
    } else if (event.key === 'ArrowRight') {
      this._moveDay(1);
    } else if (event.key === 'ArrowUp') {
      this._moveDay(-7);
    } else if (event.key === 'ArrowDown') {
      this._moveDay(7);
    } else if (event.key === 'Enter') {
      this.context.parentTabGroup.shiftFocus(1);
    }
  };

  _onFocus = () => {
    this.setState({ focused: true });
  };

  _onBlur = () => {
    this.setState({ focused: false });
  };

  _onSelectDay = newTimestamp => {
    this._onChange(moment(newTimestamp));
    this.context.parentTabGroup.shiftFocus(1);
  };

  _renderMiniMonthView() {
    if (this.state.focused) {
      return (
        <div className="mini-month-view-wrap">
          <MiniMonthView onChange={this._onSelectDay} value={this.value()} />
        </div>
      );
    }
    return false;
  }

  render() {
    const className = classnames({
      'day-text': true,
      focused: this.state.focused,
    });

    const val = this.value();
    let dayTxt = 'Click to set date';
    if (val) {
      dayTxt = this.value().format(DateUtils.DATE_FORMAT_llll_NO_TIME);
    }

    return (
      <div
        tabIndex={0}
        className="date-picker"
        onKeyDown={this._onKeyDown}
        onFocus={this._onFocus}
        onBlur={this._onBlur}
      >
        <div className={className}>{dayTxt}</div>
        {this._renderMiniMonthView()}
      </div>
    );
  }
}
