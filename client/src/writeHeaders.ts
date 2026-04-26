const BOT_HEADER = `                                                         __,_,             
                                                        [_|_/              
   ▄▄                                                    //                
  ████                ██                               _//    __           
  ████    ██▄████▄  ███████    ▄████▄   ██▄████▄      (_|)   |@@|          
 ██  ██   ██▀   ██    ██      ██▀  ▀██  ██▀   ██       \\ \\__ \\--/ __       
 ██████   ██    ██    ██      ██    ██  ██    ██        \\o__|----|  |   __ 
▄██  ██▄  ██    ██    ██▄▄▄   ▀██▄▄██▀  ██    ██            \\ }{ /\\ )_ / _\\
▀▀    ▀▀  ▀▀    ▀▀     ▀▀▀▀     ▀▀▀▀    ▀▀    ▀▀            /\\__/\\ \\__O (__
                                                           (--/\\--)    \\__/
          TS Bot Arena  (Example Bot)                      _)(  )(_        
                                                          \`---''---\`       
`;

export const writeHeaders = (): void => {
  console.log("#".repeat(80).yellow);
  console.log(BOT_HEADER.cyan);
  console.log("#".repeat(80).yellow);
};
