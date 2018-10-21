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
                <option value="ara">ערבית</option>
            </FormControl>
        )
    }
}


class SearchBox extends Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleTopic1Change = this.handleTopic1Change.bind(this);
        this.handleTopic2Change = this.handleTopic2Change.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.handleNonCacheSearch = this.handleNonCacheSearch.bind(this);
    }

    handleChange(e) {
        this.props.onTextChange(e.target.value);
    }

    handleTopic1Change(e) {
        this.props.onTopic1Change(e.target.value);
    }

    handleTopic2Change(e) {
        this.props.onTopic2Change(e.target.value);
    }

    handleKeyPress(e) {
        if (e.key === 'Enter') {
            this.props.onSearch();
        }
    }

    handleSearch() {
        this.props.onSearch();
    }

    handleNonCacheSearch() {
        this.props.onNonCacheSearch();
    }

    render() {
        const { searchText, busy, busyMessage, language, onLanguageChange } = this.props;
        return (
            <Grid>
                <Row>
                    <Col md={12}>
                        <FormGroup>
                            <ControlLabel>הזינו טקסט לחיפוש חופשי</ControlLabel>
                            <FormControl type="text" value={searchText.freeText}
                                         onChange={this.handleChange}
                                         onKeyPress={this.handleKeyPress}
                                         disabled={busy} />
                        </FormGroup>
                        <FormGroup>
                            <ControlLabel>הזינו נושאים לחיפוש מדויק</ControlLabel>
                            <FormControl type="text" value={searchText.topics[0]}
                                         onChange={this.handleTopic1Change}
                                         onKeyPress={this.handleKeyPress}
                                         disabled={busy} />
                            בשילוב עם
                            <FormControl type="text" value={searchText.topics[1]}
                                         onChange={this.handleTopic2Change}
                                         onKeyPress={this.handleKeyPress}
                                         disabled={busy} />
                        </FormGroup>
                    </Col>
                </Row>
                <Row>
                    <Col md={6}>
                        <FormGroup>
                            <ControlLabel>&nbsp;</ControlLabel>
                            <SearchActions onSearch={this.handleSearch} onNonCacheSearch={this.handleNonCacheSearch} busy={busy} busyMessage={busyMessage} />
                        </FormGroup>
                    </Col>
                    <Col md={6}>
                        <FormGroup>
                            <ControlLabel>שפה</ControlLabel>
                            <LangSelector busy={busy}
                                          language={language}
                                          onLanguageChange={onLanguageChange}
                            />
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
        this.handleNonCacheSearch = this.handleNonCacheSearch.bind(this);
    }

    handleSearch() {
        this.props.onSearch();
    }

    handleNonCacheSearch() {
        this.props.onNonCacheSearch();
    }

    render() {
        const { busy, busyMessage } = this.props;
        const content = busy ? (
            <span>{busyMessage}</span>
        ) : (
            <div>
                <Button onClick={this.handleSearch}>חיפוש מהיר עם עדכון פריטים מהGDRIVE כל שעה</Button>
                <br/><br/>
                <Button onClick={this.handleNonCacheSearch}>חיפוש איטי עם עדכון מיידי של הפריטים מהGDRIVE</Button>
            </div>
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
                        <a target="_blank" href={(process.env.REACT_APP_API_URL||'http://localhost:5050/')+'__download/'+searchId+'.xlsx'}>
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
        this.handleTopic1Change = this.handleTopic1Change.bind(this);
        this.handleTopic2Change = this.handleTopic2Change.bind(this);
        this.handleLanguageChange = this.handleLanguageChange.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.handleNonCacheSearch = this.handleNonCacheSearch.bind(this);
        this.state = {
            searchText: {freeText: '', topics: ['', '']},
            searchBusy: false,
            error: '',
            language: 'heb'
        };
    }

    handleSearchTextChange(searchText) {
        let newSearch = {freeText: searchText, topics: this.state.searchText.topics};
        this.setState({searchText: newSearch, error: ''});
    }

    handleTopic1Change(searchText) {
        let newSearch = {freeText: this.state.searchText.freeText, topics: [searchText, this.state.searchText.topics[1]]};
        this.setState({searchText: newSearch, error: ''});
    }

    handleTopic2Change(searchText) {
        let newSearch = {freeText: this.state.searchText.freeText, topics: [this.state.searchText.topics[0], searchText]};
        this.setState({searchText: newSearch, error: ''});
    }

    handleLanguageChange(language) {
        this.setState({language: language, error: ''});
    }

    handleNonCacheSearch() {
        this.handleSearch(true)
    }

    handleSearch(nonCache) {
        const { searchText, language } = this.state;
        this.setState({searchBusy: true, searchBusyMessage: 'תהליך החיפוש התחיל, נא להמתין...', error: ''});
        let langQuery = '@attr 1=Code-language ' + language;
        let topicsQuery = '', freeTextQuery = '', searchQuery = langQuery, searchPlainText = searchText.freeText;
        if (searchText.topics[0].length > 0 && searchText.topics[1].length > 0) {
            topicsQuery = '@and @attr 1=21 "' + searchText.topics[0] + '" @attr 1=21 "' + searchText.topics[1] + '"';
            searchPlainText += ' ' + searchText.topics[0] + ', ' + searchText.topics[1];
        } else if (searchText.topics[0].length > 0) {
            topicsQuery = '@attr 1=21 "' + searchText.topics[0] + '"';
            searchPlainText += ' ' + searchText.topics[0];
        } else if (searchText.topics[1].length > 0) {
            topicsQuery = '@attr 1=21 "' + searchText.topics[1] + '"';
            searchPlainText += ' ' + searchText.topics[1];
        }
        if (searchText.freeText.length > 0 ) {
            freeTextQuery = '@attr 1=1017 "' + searchText.freeText +'"';
        }
        if (topicsQuery.length > 0 && freeTextQuery.length > 0) {
            searchQuery = '@and ' + langQuery + ' @and ' + topicsQuery + ' ' + freeTextQuery;
        } else if (freeTextQuery.length > 0) {
            searchQuery = '@and ' + langQuery + ' ' + freeTextQuery;
        } else if (topicsQuery.length > 0) {
            searchQuery = '@and ' + langQuery + ' ' + topicsQuery;
        }
        if (searchPlainText.length === 0) {
            searchPlainText = '-';
        }
        fetch(`${process.env.REACT_APP_API_URL||'http://localhost:5050/'}__search/${encodeURIComponent(searchQuery)}/${encodeURIComponent(searchPlainText)}/${encodeURIComponent(language)}/${nonCache}`)
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

    render() {
        const {
            searchText, searchBusy, error, language, previewRecords, totalRecords, validRecords, searchId,
            searchBusyMessage
        } = this.state;
        const searchResult = searchBusy ? null : (
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
                                           onTopic1Change={this.handleTopic1Change}
                                           onTopic2Change={this.handleTopic2Change}
                                           searchText={searchText}
                                           busy={searchBusy}
                                           busyMessage={searchBusyMessage}
                                           onSearch={this.handleSearch}
                                           onNonCacheSearch={this.handleNonCacheSearch}
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
                            {searchResult}
                        </Col>
                    </Row>
                </Grid>
            </div>
        );
    }
}


export default App;
