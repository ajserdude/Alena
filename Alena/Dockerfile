FROM fusuf/whatsasena:latest

RUN git clone https://github.com/Afx-Abu/Alena /jsl/Alena
WORKDIR /jsl/Alena
ENV TZ=Asia/Kolkata
RUN npm install supervisor -g
RUN npm install
CMD ["node", "index.js"]
