async function analyzeRelationship(){

    const input = document.getElementById("userInput").value;
    const result = document.getElementById("result");
    const loading = document.getElementById("loading");

    if(!input.trim()){
        alert("상황을 입력해주세요.");
        return;
    }

    loading.style.display = "block";
    result.innerHTML = "";

    const SYSTEM_PROMPT = `
너는 실전 연애코치 + 인간심리 분석가 + 관계 전략가다.

현실 기반으로 분석하고 희망고문 금지.

반드시 아래 구조로 답변:

[현재 상황 분석]
[사용자의 실수]
[현실적인 가능성]
[추천 행동]
[한줄 현실 정리]
`;

    try{

        const response = await fetch("https://api.groq.com/openai/v1/chat/completions",{
            method:"POST",
            headers:{
                "Content-Type":"application/json",
                "Authorization":`Bearer ${GROQ_API_KEY}`
            },
            body:JSON.stringify({
                model:"llama-3.3-70b-versatile",
                messages:[
                    {
                        role:"system",
                        content:SYSTEM_PROMPT
                    },
                    {
                        role:"user",
                        content:input
                    }
                ],
                temperature:0.7,
                max_tokens:1500
            })
        });

        const data = await response.json();

        loading.style.display = "none";

        if(data.error){
            result.innerHTML = "오류 발생 : " + data.error.message;
            return;
        }

        result.innerHTML = data.choices[0].message.content;

    }catch(error){

        loading.style.display = "none";

        result.innerHTML = "에러 발생 : " + error.message;
    }
}
