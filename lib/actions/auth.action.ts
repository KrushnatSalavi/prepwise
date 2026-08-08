'use server';

export async function signUp(params:SignUpParams){
    const {uid, name, email} = params;
    try{

    }catch(e){
        console.error('Error creating a user', e);
        
    }
}