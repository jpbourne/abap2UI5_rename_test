CLASS zzzzzzz2ui5_cl_launchpad_handler DEFINITION
  PUBLIC
  FINAL
  CREATE PUBLIC .

  PUBLIC SECTION.

    INTERFACES if_http_extension.

  PROTECTED SECTION.
  PRIVATE SECTION.
ENDCLASS.



CLASS zzzzzzz2ui5_cl_launchpad_handler IMPLEMENTATION.

  METHOD if_http_extension~handle_request.

    zzzzzzz2ui5_cl_http_handler=>run( server ).

  ENDMETHOD.

ENDCLASS.
