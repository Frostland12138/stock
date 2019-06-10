import React, {Component} from 'react';
import { Form, Icon, Input, Button, Checkbox } from 'antd';
import './signup.css'

class NormalSignupForm extends React.Component {
    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
            }
        });
    };

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div className="container" style={{padding:'24px'}}>
                <Form onSubmit={this.handleSubmit} className="signup-form">
                    <Form.Item>
                        {getFieldDecorator('username', {
                            rules: [{ required: true, message: 'Please input your username!' }],
                        })(
                            <Input
                                prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                placeholder="Username"
                            />,
                        )}
                    </Form.Item>
                    <Form.Item>
                        {getFieldDecorator('password', {
                            rules: [{ required: true, message: 'Please input your Password!' }],
                        })(
                            <Input
                                prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                type="password"
                                placeholder="Password"
                            />,
                        )}
                    </Form.Item>
                    <Form.Item>
                        
                        
                        <Button type="primary" htmlType="submit" className="signup-form-button">
                            Sign up
                        </Button>
                        
                    </Form.Item>
                </Form>
            </div>
        );
    }
}

const WrappedNormalSignupForm = Form.create({ name: 'normal_signup' })(NormalSignupForm);

export default WrappedNormalSignupForm;
