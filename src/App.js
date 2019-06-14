import React, {Component} from 'react';
import {Table, Menu, Icon, Button, Input, Layout, Breadcrumb, Modal} from 'antd';
import {BrowserRouter as Router, Route, Link} from "react-router-dom";
import Highlighter from 'react-highlight-words';

import './App.css';
import reqwest from 'reqwest';

const {SubMenu} = Menu;
const {Header, Content, Sider} = Layout;

class ResultTable extends Component {
    constructor(props) {
        super(props);
    }

    state = {
        searchText: '',
    };

    getColumnSearchProps = dataIndex => ({
        filterDropdown: ({setSelectedKeys, selectedKeys, confirm, clearFilters}) => (
            <div style={{padding: 8}}>
                <Input
                    ref={node => {
                        this.searchInput = node;
                    }}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => this.handleSearch(selectedKeys, confirm)}
                    style={{width: 188, marginBottom: 8, display: 'block'}}
                />
                <Button
                    type="primary"
                    onClick={() => this.handleSearch(selectedKeys, confirm)}
                    icon="search"
                    size="small"
                    style={{width: 90, marginRight: 8}}
                >
                    Search
                </Button>
                <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{width: 90}}>
                    Reset
                </Button>
            </div>
        ),
        filterIcon: filtered => (
            <Icon type="search" style={{color: filtered ? '#1890ff' : undefined}}/>
        ),
        onFilter: (value, record) =>
            record[dataIndex]
                .toString()
                .toLowerCase()
                .includes(value.toLowerCase()),
        onFilterDropdownVisibleChange: visible => {
            if (visible) {
                setTimeout(() => this.searchInput.select());
            }
        },
        render: text => (
            <Highlighter
                highlightStyle={{backgroundColor: '#ffc069', padding: 0}}
                searchWords={[this.state.searchText]}
                autoEscape
                textToHighlight={text.toString()}
            />
        ),
    });

    handleSearch = (selectedKeys, confirm) => {
        confirm();
        this.setState({searchText: selectedKeys[0]});
    };

    handleReset = clearFilters => {
        clearFilters();
        this.setState({searchText: ''});
    };

    render() {
        const columns = [
            {
                title: 'Code',
                dataIndex: 'stock_id',
                key: 'stock_id',
                width: '20%',
                ...this.getColumnSearchProps('stock_id'),
            },
            {
                title: 'Name',
                dataIndex: 'stock_name',
                key: 'stock_name',
                width: '20%',
                ...this.getColumnSearchProps('stock_name'),
            },
            {
                title: 'Price',
                dataIndex: 'stock_price',
                key: 'stock_price',
                width: '15%',
            },
            {
                title: 'High',
                dataIndex: 'upper_limit',
                key: 'upper_limit',
                width: '15%',
            },
            {
                title: 'Low',
                dataIndex: 'lower_limit',
                key: 'lower_limit',
                width: '15%',
            },
            {
                title: 'State',
                dataIndex: 'stock_state',
                key: 'stock_state',
                width: '15%',
                ...this.getColumnSearchProps('stock_state'),
            },
        ];
        return <Table columns={columns} dataSource={this.props.data}/>;
    }
}

class StockHelp extends Component {
    state = {visible: false};

    showModal = () => {
        this.setState({
            visible: true,
        });
    };

    handleOk = e => {
        console.log(e);
        this.setState({
            visible: false,
        });
    };

    handleCancel = e => {
        console.log(e);
        this.setState({
            visible: false,
        });
    };

    render() {
        return (
            <div>
                <Button type="primary" onClick={this.showModal}>
                    Help
                </Button>
                <Modal
                    title="Stock Filter Guide"
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                >
                    <p>
                        <Icon type="search" style={{color: '#1890ff'}}/> Find stock name by code:
                        filter stock code
                    </p>
                    <p>
                        <Icon type="search" style={{color: '#1890ff'}}/> Find stock code by name:
                        filter stock name
                    </p>
                    <p>
                        <Icon type="search" style={{color: '#1890ff'}}/> Only show stocks not suspended:
                        filter stock state
                    </p>
                </Modal>
            </div>
        );

    }
}

class PanelStockInformation extends Component {
    constructor(props) {
        super(props);
    }

    state = {
        data: [],
        loading: false
    };

    /**
     * fetch JSON data
     */
    fetch = () => {
        this.setState({loading: true});
        reqwest({
            url: '/stock_data.json',
            method: 'get',
            type: 'json',
        }).then(data => {
            this.setState({
                loading: false,
                data: data.results,
            });
        });
    };

    componentDidMount() {
        this.fetch();
    }

    render() {
        return (
            <div>
                <div className="Instruction">
                    <StockHelp/>
                </div>
                <div className="Table" style={{paddingTop: '15px'}}>
                    <ResultTable
                        {...this.state}
                    />
                </div>
            </div>
        );
    }
}

function showPanelStockInformation() {
    return new PanelStockInformation();
}

class PanelAccountInformation extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div></div>
        );
    }
}

function showPanelAccountInformation() {
    return new PanelAccountInformation();
}

class PanelAccountUpgrade extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div></div>
        );
    }
}

function showPanelAccountUpgrade() {
    return new PanelAccountUpgrade();
}

class About extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <p>© Tianyang Zheng, Hongjia Xu.</p>
                <p>All rights reserved.</p>
            </div>
        );
    }
}

function showAbout() {
    return new About();
}

class App extends Component {

    /* this function is passed to ResultTable
     * used to simulate database change
     */
    // handleOperation = (type, matchId) => {
    //     // message.success('This is a prompt message for success, and it will disappear in 10 seconds', 10);
    //     let foundIndex = this.state.data.findIndex(x => x.matchId === matchId);
    //     if (foundIndex !== -1) {
    //         // message.success(foundIndex, 10)
    //         let currentMatch = this.state.data[foundIndex];
    //         let currentMatchHome = currentMatch.home[this.state.lang];
    //         let currentMatchGuest = currentMatch.guest[this.state.lang];
    //         let msg = '';
    //         switch (type) {
    //             case 'homeScore':
    //                 currentMatch.homeScore++;
    //                 msg = <span> <b className={"text-danger"}>{currentMatchHome} {currentMatch.homeScore}</b>
    //                 : {currentMatch.guestScore} {currentMatchGuest} </span>;
    //                 message.success(msg, 10);
    //                 break;
    //
    //         }
    //         this.setState({
    //             data: this.state.data
    //         })
    //     }
    // };

    render() {
        /* just enum in JS */
        /* the pages */
        return (
            /* layout */
            <Router>
                <Layout>
                    <Header className="header">
                        <div className="logo"/>
                        <Menu theme="dark"
                              mode="horizontal"
                              defaultSelectedKeys={['1']}
                              style={{lineHeight: '64px'}}
                        >
                            <Menu.Item key="1">
                                <Link to={`/panel/stocks/all`}>Panel</Link>
                            </Menu.Item>
                            <Menu.Item key="4">
                                <Link to={`/about`}>About</Link>
                            </Menu.Item>
                        </Menu>
                    </Header>
                    <Layout>
                        <Route exact path="/panel/*" component={() => {
                            return (
                                <Sider width={200} style={{background: '#fff'}}>
                                    <Menu
                                        mode="inline"
                                        defaultSelectedKeys={['1']}
                                        defaultOpenKeys={['sub1']}
                                        style={{height: '100%', borderRight: 0}}
                                    >
                                        <SubMenu
                                            key="sub1"
                                            title={<span> <Icon type={"search"}/>Stocks</span>}
                                        >
                                            <Menu.Item key="1">
                                                <Link to={`/panel/stocks/all`}>All</Link>
                                            </Menu.Item>
                                        </SubMenu>
                                        <SubMenu
                                            key="sub2"
                                            title={<span> <Icon type="user"/>Account</span>}
                                        >
                                            <Menu.Item key="2">
                                                <Link to={`/panel/account/info`}>Information</Link>
                                            </Menu.Item>
                                            <Menu.Item key="3">
                                                <Link to={`/panel/account/upgrade`}>Upgrade</Link>
                                            </Menu.Item>
                                        </SubMenu>
                                    </Menu>
                                </Sider>
                            )
                        }}/>
                        <Route exact path="/about" component={() => {
                            return (
                                <Sider width={200} style={{background: '#fff'}}>
                                    <Menu
                                        mode="inline"
                                        defaultSelectedKeys={['1']}
                                        defaultOpenKeys={['sub1']}
                                        style={{height: '100%', borderRight: 0}}
                                    >
                                        <Menu.Item key="8">
                                            <span><Icon type={"info"}/>About</span>
                                        </Menu.Item>
                                    </Menu>
                                </Sider>
                            )
                        }}/>
                        <Layout style={{padding: '0 24px 24px'}}>
                            <Route exact path="/" component={() => {
                                return <Breadcrumb.Item/>
                            }}/>
                            <Route exact path="/panel/stocks/all" component={() => {
                                return (
                                    <Breadcrumb style={{margin: '16px 0'}}>
                                        <Breadcrumb.Item>Panel</Breadcrumb.Item>
                                        <Breadcrumb.Item>Stocks</Breadcrumb.Item>
                                        <Breadcrumb.Item>All</Breadcrumb.Item>
                                    </Breadcrumb>
                                )
                            }}/>
                            <Route exact path="/panel/account/info" component={() => {
                                return (
                                    <Breadcrumb style={{margin: '16px 0'}}>
                                        <Breadcrumb.Item>Panel</Breadcrumb.Item>
                                        <Breadcrumb.Item>Account</Breadcrumb.Item>
                                        <Breadcrumb.Item>Information</Breadcrumb.Item>
                                    </Breadcrumb>
                                )
                            }}/>
                            <Route exact path="/panel/account/upgrade" component={() => {
                                return (
                                    <Breadcrumb style={{margin: '16px 0'}}>
                                        <Breadcrumb.Item>Panel</Breadcrumb.Item>
                                        <Breadcrumb.Item>Account</Breadcrumb.Item>
                                        <Breadcrumb.Item>Upgrade</Breadcrumb.Item>
                                    </Breadcrumb>
                                )
                            }}/>
                            <Route exact path="/about" component={() => {
                                return (
                                    <Breadcrumb style={{margin: '16px 0'}}>
                                        <Breadcrumb.Item>About</Breadcrumb.Item>
                                    </Breadcrumb>
                                )
                            }}/>

                            <Content
                                style={{
                                    background: '#fff',
                                    padding: 24,
                                    margin: 0,
                                    minHeight: 280,
                                }}
                            >
                                <Route exact path="/" component={showPanelStockInformation}/>
                                <Route exact path="/panel/stocks/all" component={showPanelStockInformation}/>
                                <Route exact path="/panel/account/info" component={showPanelAccountInformation}/>
                                <Route exact path="/panel/account/upgrade" component={showPanelAccountUpgrade}/>
                                <Route exact path="/about" component={showAbout}/>
                            </Content>
                        </Layout>
                    </Layout>
                </Layout>
            </Router>

        );
    }
}

export default App;
