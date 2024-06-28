import {useTheme} from "antd-style";
import {ProChat} from "@ant-design/pro-chat";
import React, {useEffect, useState} from "react";
import {Helmet, HelmetProvider} from "react-helmet-async";
import {useParams} from "react-router-dom";
import Avatar from '../avatar.png'
import Logo from '../logo.png'
import { Typography } from 'antd';
const { Text} = Typography;

const getUserInfo = async (token: any) => {
    const response = await fetch('http://localhost:8000/api/user', {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token,
      },
        mode: 'cors',
    });

    return await response.json();
}

const Chatbot = () => {
    const [userInfo, setUserInfo] = useState<any>();
    const theme = useTheme();
    const {token} = useParams();

  useEffect(() => {
      if (typeof token === "string") {
          localStorage.setItem('authorization_token', token);
      }
    getUserInfo(token).then(data => {
        if (data.avatar === null) {
            data.avatar = Avatar;
        }

      setUserInfo(data);
    }).catch(err => {
      console.log(err);
    });
  }, []);

  const handleRequest = async (messages: string | any[]) => {
    const latestMessage = messages[messages.length - 1].content;

    const response = await fetch('http://localhost:5000/query', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ question: latestMessage }),
    });

    const data = await response.json();

    let responseData = "";
    if (data.status === 'OK') {
        responseData = `
${data.main_answer.field ? '## Lĩnh vực: ' + data.main_answer.field : ''}
${data.main_answer.source_url ? '#### Nguồn câu hỏi thu thập: ['+ data.main_answer.title +'](' + data.main_answer.source_url + ')': ''}
${data.main_answer.reference ? '### Tham khảo: ' + data.main_answer.reference : ''}
${data.main_answer.quote != null && data.main_answer.quote.name ? '**Tiêu đề: ' + data.main_answer.quote.name + '** \n\n' : ''}
${data.main_answer.quote ? data.main_answer.quote.content.map((item: any) => `${item}`).join('\n') : ''}
${data.main_answer.conclusion ? '### Kết luận: \n\n' + data.main_answer.conclusion.map((item: any) => `${item}`).join('\n\n') : ''}
### Câu hỏi tương tự: \n
${data.similar_questions.map((q: { title: string; source_url: string; }) => '- [' + q.title + ']('+ q.source_url +')').join(' \n\n ')}

#### Câu trả lời có thể có sai sót hoặc đã cũ, vui lòng kiểm tra thông tin trên trang web chính thức của cơ quan pháp luật hoặc liên hệ với luật sư để được tư vấn chính xác hơn.
`;
    } else if (data.status === 'ERROR') {
        responseData = "### " + data.message;
    } else {
        responseData = "### Đã có lỗi xảy ra, vui lòng thử lại sau.";
    }

    return new Response(responseData);
  };

  return (
      <HelmetProvider>
          <Helmet>
              <title>Chatbot LawLaboratory</title>
          </Helmet>

          <div style={{ background: theme.colorBgLayout, height: '90vh', width: '100vw' }}>
              <ProChat
                  showTitle
                  displayMode={'docs'}
                  locale="en-US"
                  helloMessage="Xin chào, tôi là chatbot tư vấn Pháp luật Việt Nam, tôi có thể giúp gì cho bạn?"
                  request={handleRequest}
                  userMeta={{
                      avatar: userInfo?.avatar,
                      title: userInfo?.name,
                  }}
                  assistantMeta={{
                      avatar: Logo,
                      title: 'Chatbot LawLaboratory',
                  }}

              />
          </div>
      </HelmetProvider>

  );
};

export default Chatbot;