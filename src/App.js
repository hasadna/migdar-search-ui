import React, { Component } from 'react';
import './App.css';
import {
    FormGroup, FormControl, ControlLabel, Well, ButtonGroup, Button, Alert,
    Grid, Row, Col
} from 'react-bootstrap';


class LangSelector extends Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e) {
        this.props.onLanguageChange(e.target.value);
    }

    render() {
        const busy = this.props.busy;
        const language = this.props.language;
        return (
            <FormControl componentClass="select" disabled={busy} value={language} onChange={this.handleChange}>
                <option value="heb" defaultValue={true}>עברית</option>
                <option value="eng">אנגלית</option>
                <option value="arb">ערבית</option>
            </FormControl>
        )
    }
}


class SearchBox extends Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
    }

    handleChange(e) {
        this.props.onTextChange(e.target.value);
    }

    handleKeyPress(e) {
        if (e.key === 'Enter') {
            this.props.onSearch();
        }
    }

    handleSearch() {
        this.props.onSearch();
    }

    render() {
        const { searchText, busy, busyMessage, language, onLanguageChange } = this.props;
        return (
            <Grid>
                <Row>
                    <Col md={3}>
                        <FormGroup>
                            <ControlLabel>&nbsp;</ControlLabel>
                            <SearchActions searchText={searchText} onSearch={this.handleSearch} busy={busy} busyMessage={busyMessage} />
                        </FormGroup>
                    </Col>
                    <Col md={3}>
                        <FormGroup>
                            <ControlLabel>שפה</ControlLabel>
                            <LangSelector busy={busy}
                                          language={language}
                                          onLanguageChange={onLanguageChange}
                            />
                        </FormGroup>
                    </Col>
                    <Col md={6}>
                        <FormGroup>
                            <ControlLabel>הזינו טקסט לחיפוש ברשימה המאוחדת</ControlLabel>
                            <FormControl type="text" value={searchText}
                                         onChange={this.handleChange}
                                         onKeyPress={this.handleKeyPress}
                                         disabled={busy} />
                        </FormGroup>
                    </Col>
                </Row>
            </Grid>
        )
    }
}


class SearchActions extends Component {
    constructor(props) {
        super(props);
        this.handleSearch = this.handleSearch.bind(this);
    }

    handleSearch() {
        this.props.onSearch();
    }

    render() {
        const { searchtext, busy, busyMessage } = this.props;
        const content = busy ? (
            <span>{busyMessage}</span>
        ) : (
            <Button onClick={this.handleSearch}>חיפוש</Button>
        );
        return (
            <div>{content}</div>
        )
    }
}


class ErrorBox extends Component {
    render() {
        const error = this.props.error;
        return error ? (
            <Alert bsStyle="danger" style={{marginTop: 10}}>
                אירעה שגיאה:
                "{error}"
            </Alert>
        ) : null;
    }
}


class SearchResult extends Component {
    render() {
        const { previewRecords, totalRecords, searchId, validRecords } = this.props;
        if (searchId) {
            let searchResults = null;
            if (previewRecords.length > 0) {
                searchResults = (
                    <table className="table">
                        <thead>
                            <tr>
                                <th>author</th>
                                <th>title</th>
                                <th>url</th>
                                <th>tags</th>
                                <th>pubyear</th>
                            </tr>
                        </thead>
                        <tbody>
                            {previewRecords.map(record => (
                                <tr>
                                    <td>{record.author}</td>
                                    <td>{record.title}</td>
                                    <td>{record.url}</td>
                                    <td>{record.tags}</td>
                                    <td>{record.pubyear}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                );
            }
            return (
                <div>
                    <h4>התקבלו {totalRecords} תוצאות מהULI, מתוכן {validRecords} תוצאות תקינות שאינן מופיעות בגוגל דרייב</h4>
                    {validRecords > 0 ? (
                        <a target="_blank" href={(process.env.REACT_APP_API_URL||'http://localhost:5050/')+'download/'+searchId+'.xlsx'}>
                            ליחצו כאן להורדת קובץ אקסל עם כל התוצאות התקינות
                        </a>
                    ) : null}
                    {validRecords > 10 ? (
                        <h5>מציג 10 תוצאות ראשונות</h5>
                    ) : null}
                    {searchResults}
                </div>
            )
        } else {
            return null;
        }
    }
}


class App extends Component {
    constructor(props) {
        super(props);
        this.handleSearchTextChange = this.handleSearchTextChange.bind(this);
        this.handleLanguageChange = this.handleLanguageChange.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.state = {
            searchText: '',
            searchBusy: false,
            error: '',
            language: 'heb'
        };
    }

    handleSearchTextChange(searchText) {
        this.setState({searchText: searchText, error: ''});
    }

    handleLanguageChange(language) {
        this.setState({language: language, error: ''});
    }

    handleSearch() {
        const { searchText, language } = this.state;
        if (searchText.length > 0) {
            this.setState({searchBusy: true, searchBusyMessage: 'תהליך החיפוש התחיל, נא להמתין...', error: ''});
            fetch(`${process.env.REACT_APP_API_URL||'http://localhost:5050/'}search/${encodeURIComponent(language)}/${encodeURIComponent(searchText)}`)
                .then(res => res.json())
                .then(
                    (res) => {
                        this.setState({
                            searchBusy: false,
                            error: '',
                            totalRecords: res['total_records'],
                            validRecords: res['xlsx_records'],
                            searchId: res['search_id'],
                            previewRecords: res['first_10_new_records']
                        });
                    },
                    (error) => {
                        this.setState({searchBusy: false, error: error.message});
                    }
                )
        }
    }

    render() {
        const {
            searchText, searchBusy, error, language, previewRecords, totalRecords, validRecords, searchId,
            searchBusyMessage
        } = this.state;
        const searchResult = (
            <SearchResult previewRecords={previewRecords}
                          totalRecords={totalRecords}
                          validRecords={validRecords}
                          searchId={searchId}
            />
        );
        return (
            <div dir="rtl">
                <Well>
                    <Grid>
                        <Row>
                            <Col md={12}>
                                <SearchBox onTextChange={this.handleSearchTextChange}
                                           searchText={searchText}
                                           busy={searchBusy}
                                           busyMessage={searchBusyMessage}
                                           onSearch={this.handleSearch}
                                           language={language}
                                           onLanguageChange={this.handleLanguageChange}
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col md={12}>
                                <ErrorBox error={error} />
                            </Col>
                        </Row>
                        <Row>
                            <Col md={12}>
                            </Col>
                        </Row>
                    </Grid>
                </Well>
                <Grid>
                    <Row>
                        <Col md={12}>
                            <SearchResult previewRecords={previewRecords}
                                          totalRecords={totalRecords}
                                          validRecords={validRecords}
                                          searchId={searchId}
                            />
                        </Col>
                    </Row>
                </Grid>
            </div>
        );
    }
}


export default App;
