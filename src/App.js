import React, {Component} from 'react';
import {Checkbox, Table, Menu, Icon, Form, Drawer, Button, Col, Row, Input, Layout, Breadcrumb} from 'antd';

import './App.css';
import reqwest from 'reqwest';

const {SubMenu} = Menu;
const {Header, Content, Sider} = Layout;

/**
 * test if the form input has error
 * @param fieldsError
 * @returns {boolean}
 */
function hasErrors(fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
}

/**
 * the search bar
 * copied from antd
 */
class HorizontalSearchForm extends React.Component {
    componentDidMount() {
        // To disabled submit button at the beginning.
        this.props.form.validateFields();
    }

    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
            }
        });
    };

    render() {
        const {getFieldDecorator, getFieldsError, getFieldError, isFieldTouched} = this.props.form;

        // Only show error after a field is touched.
        const searchError = isFieldTouched('search') && getFieldError('search');
        return (
            <div className="container " align="right" style={{padding: "0"}}>
                <Form layout="inline" onSubmit={this.handleSubmit} style={{margin: "0"}}>
                    <Form.Item validateStatus={searchError ? 'error' : ''} help={searchError || ''}>
                        {getFieldDecorator('username', {
                            rules: [{required: true, message: 'Please input your username!'}],
                        })(
                            <Input
                                prefix={<Icon type="search" style={{color: 'rgba(0,0,0,.25)'}}/>}
                                placeholder="Search by code"
                            />,
                        )}
                    </Form.Item>
                    <Form.Item style={{margin: "0"}}>
                        <Button type="primary" htmlType="submit" disabled={hasErrors(getFieldsError())}>
                            Search
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        );
    }
}

const WrappedHorizontalSearchForm = Form.create({name: 'horizontal_search'})(HorizontalSearchForm);

/**
 * the drawer
 * copied from antd
 */
class DrawerForm extends React.Component {
    state = {
        visible: false,
        nametocode: true
    };

    showDrawer = () => {
        this.setState({
            visible: true,
        });
    };

    onClose = () => {
        this.setState({
            visible: false,
        });
    };

    handleNameToCodeChange = () => {
        this.setState({
            nametocode: true
        })
    };

    handleCodeToNameChange = () => {
        this.setState({
            nametocode: false
        })
    };

    render() {
        const {getFieldDecorator} = this.props.form;
        return (
            <div>
                <Button type="primary" onClick={this.showDrawer}>
                    <Icon type="right"/> Convert
                </Button>
                <Drawer
                    title="Convert between stock name and code"
                    width={480}
                    onClose={this.onClose}
                    visible={this.state.visible}
                >
                    <Form layout="vertical" hideRequiredMark>
                        {/* divide the drawer into rows and columns */}
                        <Row gutter={16}>
                            <Col span={4}>
                                {/*margin: external whitespace; padding: internal whitespace */}
                                <div className="container" align="right" style={{margin: "0", padding: "0"}}>
                                    {/* I did not use a group of radio buttons here since the buttons
                                    are spatially separated. Instead, I used two checkboxes and a function
                                    to handle the change. */}
                                    <Checkbox checked={this.state.nametocode} onChange={this.handleNameToCodeChange}/>
                                </div>
                            </Col>
                            <Col span={16}>
                                <Form.Item label="Name to code">
                                    {getFieldDecorator('name', {
                                        rules: [{required: true, message: 'Please enter stock name'}],
                                    })(<Input placeholder="Please enter stock name"/>)}
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={4}>
                                <div className="container" align="right" style={{margin: "0", padding: "0"}}>
                                    <Checkbox checked={!this.state.nametocode} onChange={this.handleCodeToNameChange}/>
                                </div>
                            </Col>
                            <Col span={16}>
                                <Form.Item label="Code to name">
                                    {getFieldDecorator('name', {
                                        rules: [{required: true, message: 'Please enter stock code'}],
                                    })(<Input placeholder="Please enter stock code"/>)}
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                    <div
                        style={{
                            position: 'absolute',
                            left: 0,
                            bottom: 0,
                            width: '100%',
                            borderTop: '1px solid #e9e9e9',
                            padding: '10px 16px',
                            background: '#fff',
                            textAlign: 'right',
                        }}
                    >
                        <Button onClick={this.onClose} style={{marginRight: 8}}>
                            Cancel
                        </Button>
                        <Button onClick={this.onClose} type="primary">
                            Submit
                        </Button>
                    </div>
                </Drawer>
            </div>
        );
    }
}

const ConvertForm = Form.create()(DrawerForm);

/**
 * the table
 */
class ResultTable extends Component {

    render() {
        const columns = [
            {
                title: 'Code',
                dataIndex: 'stock_id',
                render: id => <span>{id}</span>,
            },
            {
                title: 'Name',
                dataIndex: 'stock_name',
                render: name => <span>{name}</span>,
            },
            {
                title: 'Price',
                dataIndex: 'stock_price',
                render: price => <span>{price}</span>,
            },
            {
                title: 'High',
                dataIndex: 'upper_limit',
                render: high => <span>{high}</span>,
            },
            {
                title: 'Low',
                dataIndex: 'lower_limit',
                render: low => <span>{low}</span>,
            },
            {
                title: 'State',
                dataIndex: 'stock_state',
                render: state => <span>{state}</span>,
            },

            /* the following column contains colored badgers
            * could be used to color the ups (red) and downs (green) */
            // {
            //     title: 'Home Team',
            //     dataIndex: 'home',
            //     render: (home, record) => <div>
            //         <Badge className={"mr-1"} count={record.homeYellow} style={{
            //             display: this.state.showYellow ? 'block' : 'none',
            //             borderRadius: 0,
            //             backgroundColor: 'yellow',
            //             color: '#999',
            //             boxShadow: '0 0 0 1px #d9d9d9 inset'
            //         }}/>
            //         <Badge className={"mr-1"} count={record.homeRed} style={{
            //             display: this.state.showRed ? 'block' : 'none',
            //             borderRadius: 0,
            //             backgroundColor: 'red',
            //             color: '#999',
            //             boxShadow: '0 0 0 1px #d9d9d9 inset'
            //         }}/>
            //         <span>{home[this.state.lang]}</span>
            //     </div>
            // },

            /* the following column contains simulation buttons
            * could be used to simulate database change
            * works in coordinate with handleOperation function in App class */
            // {
            //     title: 'Simulation',
            //     dataIndex: 'operation',
            //     render: (value, record) =>
            //         <Dropdown
            //             overlay={
            //                 <Menu>
            //                     <Menu.Item key="0">
            //                         <a onClick={e => this.handleOperation("homeScore", record.matchId)}>home score</a>
            //                     </Menu.Item>
            //                     <Menu.Item key="1">
            //                         <a onClick={e => this.handleOperation(record.matchId)}>guest score</a>
            //                     </Menu.Item>
            //                     <Menu.Divider/>
            //                     <Menu.Item key="3">3rd menu item</Menu.Item>
            //                 </Menu>}
            //             trigger={['click']}>
            //             <a className="ant-dropdown-link">
            //                 Simulation<Icon type="down"/>
            //             </a>
            //         </Dropdown>,
            // }
        ];

        return (
            <div className="container mt-3">

                <Table
                    dataSource={this.props.data}
                    columns={columns}
                    size={"middle"}
                    pagination={false}
                    rowKey={record => record.stock_id}
                    loading={this.props.loading}
                />

            </div>
        );

    }

}

class StockInformation extends Component {
    render() {
        return (
            <div className="App">
                <Layout>
                    <Sider width={200} style={{background: '#fff'}}>
                        <div className={"container mt-1"}>
                            {/** the convert button */}
                            <ConvertForm/>
                        </div>
                    </Sider>
                    <Layout style={{background: '#fff'}}>
                        <div className="container">
                            {/** the search bar*/}
                            <WrappedHorizontalSearchForm/>
                        </div>
                    </Layout>
                </Layout>

                {/**
                 * data: database data
                 * loading: whether the data is loading
                 */}
                <ResultTable
                    data={this.props.data}
                    loading={this.props.loading}
                />

            </div>
        )
    }

}


/**
 * the outmost class
 * page layout is set in this class
 * other components are then added into the layout
 */
class App extends Component {

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

    /* this function could be used write click events to console */
    // handleClick = e => {
    //     console.log('click ', e);
    // };

    componentDidMount() {
        this.fetch();
    }

    handlePageChange = (page) => {
        //TODO: switch between pages

    };

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
        var PageEnum = Object.freeze({
            "PanelStocksInformation": 1,
            "PanelAccountInformation": 2,
            "PanelAccountUpgrade": 3,
            "About": 4
        });

        return (
            /* layout */
            <Layout>
                <Header className="header">
                    <div className="logo"/>
                    <Menu
                        theme="dark"
                        mode="horizontal"
                        defaultSelectedKeys={['1']}
                        style={{lineHeight: '64px'}}
                    >
                        <Menu.Item key="1" onClick={this.handlePageChange(PageEnum.PanelStocksInformation)}>
                            Panel
                        </Menu.Item>
                        <Menu.Item key="2" onClick={this.handlePageChange(PageEnum.About)}>
                            About
                        </Menu.Item>
                    </Menu>
                </Header>
                <Layout>
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
                                <Menu.Item key="1" onClick={this.handlePageChange(PageEnum.PanelStocksInformation)}>Show
                                    all</Menu.Item>
                            </SubMenu>
                            <SubMenu
                                key="sub2"
                                title={<span> <Icon type="user"/>Account</span>}
                            >
                                <Menu.Item key="2" onClick={this.handlePageChange(PageEnum.PanelAccountInformation)}>
                                    Information
                                </Menu.Item>
                                <Menu.Item key="3" onClick={this.handlePageChange(PageEnum.PanelAccountUpgrade)}>
                                    Upgrade
                                </Menu.Item>
                            </SubMenu>
                        </Menu>
                    </Sider>
                    <Layout style={{padding: '0 24px 24px'}}>
                        <Breadcrumb style={{margin: '16px 0'}}>
                            <Breadcrumb.Item>Panel</Breadcrumb.Item>
                            <Breadcrumb.Item>Stocks</Breadcrumb.Item>
                            <Breadcrumb.Item>Show all</Breadcrumb.Item>
                        </Breadcrumb>
                        <Content
                            style={{
                                background: '#fff',
                                padding: 24,
                                margin: 0,
                                minHeight: 280,
                            }}
                        >
                            {/* Panel / Stocks / Show all */}
                            <StockInformation
                                data={this.state.data}
                                loading={this.state.loading}
                            />
                        </Content>
                    </Layout>
                </Layout>
            </Layout>

        );
    }
}

export default App;