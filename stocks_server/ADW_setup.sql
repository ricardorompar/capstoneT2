--Create your own copy of SH schema:

create user CAPSTONE IDENTIFIED BY "AaZZ0r_cle#1";  --creating new user schema
GRANT CONNECT, resource TO CAPSTONE;    --granting permissions to this user
 
ALTER USER CAPSTONE QUOTA UNLIMITED ON DATA;

BEGIN
    ords_admin.enable_schema (
        p_enabled               => TRUE,
        p_schema                => 'CAPSTONE',
        p_url_mapping_type      => 'BASE_PATH',
        p_url_mapping_pattern   => 'capstone', -- this flag says, use 'capstone' in the URIs for CAPSTONE
        p_auto_rest_auth        => TRUE   -- this flag says, don't expose my REST APIs
    );
    COMMIT;
END;
/

--Now the tables??
--Firs connect to the schema