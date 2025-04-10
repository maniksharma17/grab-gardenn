"use client";
import React from "react";
import { RecoilRoot } from "recoil";
import Script from "next/script";

const HomeLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <RecoilRoot>
      <Script src="https://run.confettipage.com/here.js" data-confetticode="U2FsdGVkX1/MbDvb8H3pL7pnpNM7axi1z16mn4bwsG/ZWgCxHpM7QKO2lJPjgSBTcfhKp0KetGr+Jn0L+scQUJgu0J1SU+auOepLPfVyW14KCZj8sTzkK3QjC6g2KdGgdqPx1v8nhC2L1B8ZBrywlB8nzr93qHUK3xxEmQoBnaDBO9H1UCTIYZfjky7ZSenMchR9oYOehlDCoArdJwk8mPZopGCPVJ5vEwoUihhdusSOUfCLKcW248a0Ht+ont+gTMPNth7+Vphb8I1A8Gb1sVjjm1rVgqEssJNuGL6MkeE1QfDFefPRAB4FQvdfMUUOLtINIfnXwHmcyOws6odSJ93/W2nga8bsr+gTSk9Zp0tqXu2vbJtEsS/FoMsjtBv+O1Qf0uJ6UYwZvokYJ58kGeKBPwS2rjRd/z2k/pfGrJLYgbukmDjoexkqa0ovZeWAt05T7XGPQjqpz0zSNxOchIka0/oVooTAaQHqusT4gwHhyQph2tGNh2VAQsv9GESRK3lnM7Uq9zJYDbGqY9gtlOr7yALgryCPt8NZWsjmSLTkmvpOneJZe1PlDMi2sruScroazNv9utRsvy5KwR4284eJ9QgEzFSnY1fi/ZvqDL9k75xH95J7F94qRhH0YvIvbN9dLa3ZfUwF/q4GhYg0nQNYTLyxzh6Eu79l9y1uyi7rUNK0QOAI4pxewkqabT2stz/XXR+pHxSqRmGV9Ow/A4Kv+x+XuaoWAp5y/wKzj0o="></Script>
      {children}
    </RecoilRoot>
  );
};

export default HomeLayout;
